import type { Prisma, StatutDemande, TypeDocument } from '@prisma/client'
import { prisma } from '../config/db'
import { env } from '../config/env'
import { HttpError } from '../utils/errors'
import { genererReference } from '../utils/dates'
import * as journal from './journal.service'
import { notifierFamille } from './notifications.service'
import { MESSAGES_FAMILLE, transitionAutorisee } from './etats'
import {
  calculerDelaiAnnonce,
  calculerFrais,
  estAncien,
  expressDisponible,
  type TarifConfig,
} from './tarification.service'

export const tarifConfig: TarifConfig = {
  fraisSuiviXof: env.FRAIS_SUIVI_XOF,
  fraisExpressXof: env.FRAIS_EXPRESS_XOF,
  majorationAncienPourcent: env.MAJORATION_ANCIEN_POURCENT,
  ancienneteSeuilAnnees: env.ANCIENNETE_SEUIL_ANNEES,
}

export interface CreerDemandeInput {
  etablissementId: string
  typeDocument: TypeDocument
  anneeSortie: number
  eleveNom: string
  elevePrenom: string
  dateNaissance?: Date
  urgence: boolean
  echeanceExterieure?: Date
  motifEcheance?: string
  mandat: { mandantNom: string; consentementDepot: true; consentementTransmission: true }
}

/** Devis : montant et délai annoncé, sans rien créer. */
export async function devis(etablissementId: string, anneeSortie: number, urgence: boolean) {
  const etab = await prisma.etablissement.findUnique({ where: { id: etablissementId } })
  if (!etab || !etab.actif) throw new HttpError(404, 'Établissement introuvable')
  if (urgence && !expressDisponible(tarifConfig)) {
    throw new HttpError(422, "La formule express n'est pas encore disponible")
  }

  const ancien = estAncien(anneeSortie, tarifConfig.ancienneteSeuilAnnees)
  return {
    ...calculerFrais(urgence, tarifConfig),
    ancien,
    delaiAnnonceJours: calculerDelaiAnnonce(etab.delaiMesureJours, ancien, tarifConfig.majorationAncienPourcent),
    envoiFactureEnSus: true,
  }
}

export async function creerDemande(userId: string, input: CreerDemandeInput, ip?: string) {
  const d = await devis(input.etablissementId, input.anneeSortie, input.urgence)

  return prisma.$transaction(async (tx) => {
    const demande = await tx.demande.create({
      data: {
        reference: genererReference(),
        userId,
        etablissementId: input.etablissementId,
        typeDocument: input.typeDocument,
        anneeSortie: input.anneeSortie,
        eleveNom: input.eleveNom,
        elevePrenom: input.elevePrenom,
        dateNaissance: input.dateNaissance,
        urgence: input.urgence,
        echeanceExterieure: input.echeanceExterieure,
        motifEcheance: input.motifEcheance,
        ancien: d.ancien,
        delaiAnnonceJours: d.delaiAnnonceJours,
        fraisSuiviXof: d.fraisSuiviXof,
        fraisExpressXof: d.fraisExpressXof,
        // Pas de dépôt ni de transmission sans mandat écrit de la famille
        mandat: {
          create: {
            mandantNom: input.mandat.mandantNom,
            consentementDepot: true,
            consentementTransmission: true,
            ip,
          },
        },
      },
    })
    await journal.enregistrer(tx, demande.id, {
      type: 'DEMANDE_CREEE',
      statutApres: 'EN_ATTENTE_PAIEMENT',
      message: 'Demande créée, mandat accepté',
      auteurId: userId,
    })
    return demande
  })
}

/** Dates automatiques posées lors de certains changements d'état. */
function datesPourStatut(statut: StatutDemande, now: Date): Prisma.DemandeUpdateInput {
  switch (statut) {
    case 'DEPOSEE_ETABLISSEMENT':
      return { dateDepotEtablissement: now }
    case 'SIGNEE':
      return { dateSignature: now }
    case 'SCAN_ENVOYE':
      return { dateObtention: now }
    case 'CLOTUREE':
      return { clotureeLe: now }
    default:
      return {}
  }
}

export async function changerStatut(
  demandeId: string,
  nouveau: StatutDemande,
  auteurId: string | null,
  message?: string,
  tx?: Prisma.TransactionClient,
) {
  const run = async (db: Prisma.TransactionClient) => {
    const demande = await db.demande.findUnique({ where: { id: demandeId } })
    if (!demande) throw new HttpError(404, 'Demande introuvable')
    if (!transitionAutorisee(demande.statut, nouveau)) {
      throw new HttpError(409, `Transition impossible : ${demande.statut} → ${nouveau}`)
    }
    const maj = await db.demande.update({
      where: { id: demandeId },
      data: { statut: nouveau, ...datesPourStatut(nouveau, new Date()) },
    })
    await journal.enregistrer(db, demandeId, {
      type: 'CHANGEMENT_STATUT',
      statutAvant: demande.statut,
      statutApres: nouveau,
      message,
      auteurId,
    })
    return maj
  }

  const resultat = tx ? await run(tx) : await prisma.$transaction(run)
  const texte = MESSAGES_FAMILLE[nouveau]
  if (texte) void notifierFamille(demandeId, texte)
  return resultat
}

export async function enregistrerDeplacement(demandeId: string, auteurId: string, message?: string) {
  return prisma.$transaction(async (tx) => {
    const maj = await tx.demande.update({
      where: { id: demandeId },
      data: { nbDeplacements: { increment: 1 } },
    })
    await journal.enregistrer(tx, demandeId, {
      type: 'DEPLACEMENT',
      message: message ?? `Déplacement n°${maj.nbDeplacements}`,
      auteurId,
    })
    return maj
  })
}

export async function definirEnvoi(
  demandeId: string,
  auteurId: string,
  coutEnvoiXof: number,
  adresseEnvoi: string,
) {
  return prisma.$transaction(async (tx) => {
    const maj = await tx.demande.update({
      where: { id: demandeId },
      data: { coutEnvoiXof, adresseEnvoi },
    })
    await journal.enregistrer(tx, demandeId, {
      type: 'ENVOI_DEFINI',
      message: `Envoi au coût réel : ${coutEnvoiXof} F CFA`,
      auteurId,
    })
    return maj
  })
}

export async function cloturerResultats(
  demandeId: string,
  auteurId: string,
  data: { echeanceTenue: boolean; pieceRemplacementSuffisante?: boolean },
) {
  return prisma.$transaction(async (tx) => {
    const maj = await tx.demande.update({ where: { id: demandeId }, data })
    await journal.enregistrer(tx, demandeId, {
      type: 'RESULTAT_ENREGISTRE',
      message: `Échéance tenue : ${data.echeanceTenue ? 'oui' : 'non'}${
        data.pieceRemplacementSuffisante ? ' · pièce de remplacement suffisante' : ''
      }`,
      auteurId,
    })
    return maj
  })
}

export function lireDemande(id: string) {
  return prisma.demande.findUnique({
    where: { id },
    include: {
      etablissement: true,
      paiements: true,
      documents: { where: { supprimeLe: null } },
      journal: { orderBy: { createdAt: 'asc' } },
    },
  })
}
