import crypto from 'node:crypto'
import type { Operateur, Paiement, TypePaiement } from '@prisma/client'
import { prisma } from '../config/db'
import { env } from '../config/env'
import { HttpError } from '../utils/errors'
import { initierPaiementTMoney } from '../integrations/tmoney.client'
import { initierPaiementFlooz } from '../integrations/flooz.client'
import {
  PaygateError,
  initierPaygate,
  verifierPaygate,
  type PaygateConfig,
} from '../integrations/paygate.client'
import { logger } from '../utils/logger'
import * as journal from './journal.service'
import { changerStatut } from './demandes.service'

export async function initierPaiement(
  userId: string,
  input: { demandeId: string; type: TypePaiement; operateur: Operateur; telephone: string },
) {
  const demande = await prisma.demande.findUnique({ where: { id: input.demandeId } })
  if (!demande || demande.userId !== userId) throw new HttpError(404, 'Demande introuvable')

  // Le montant est calculé côté serveur, jamais fourni par le client
  let montant: number
  if (input.type === 'SUIVI') {
    if (demande.statut !== 'EN_ATTENTE_PAIEMENT') throw new HttpError(409, 'Frais de suivi déjà réglés')
    montant = demande.fraisSuiviXof + demande.fraisExpressXof
  } else {
    if (!demande.coutEnvoiXof) throw new HttpError(409, "Le coût d'envoi n'est pas encore défini")
    montant = demande.coutEnvoiXof
  }

  const paiement = await prisma.paiement.create({
    data: {
      demandeId: demande.id,
      type: input.type,
      montantXof: montant,
      operateur: input.operateur,
      telephone: input.telephone,
    },
  })

  if (env.PAYMENT_PROVIDER === 'paygate') return lancerPaygate(paiement, demande.reference)

  // Mode simulation : aucun argent ne bouge, la confirmation passe par le webhook signé
  const initier = input.operateur === 'TMONEY' ? initierPaiementTMoney : initierPaiementFlooz
  const { referenceExterne } = await initier({
    montantXof: montant,
    telephone: input.telephone,
    reference: paiement.id,
  })

  return prisma.paiement.update({ where: { id: paiement.id }, data: { referenceExterne } })
}

function configPaygate(): PaygateConfig {
  if (!env.PAYGATE_AUTH_TOKEN) throw new HttpError(500, 'Le paiement mobile est indisponible.')
  return { baseUrl: env.PAYGATE_BASE_URL, authToken: env.PAYGATE_AUTH_TOKEN, timeoutMs: env.PAYGATE_TIMEOUT_MS }
}

/** Lance le paiement chez PayGate : le client reçoit une demande de confirmation sur son téléphone. */
async function lancerPaygate(paiement: Paiement, referenceDemande: string) {
  try {
    const { txReference } = await initierPaygate(configPaygate(), {
      montantXof: paiement.montantXof,
      telephone: paiement.telephone,
      reseau: paiement.operateur, // TMONEY | FLOOZ
      identifier: paiement.id, // notre identifiant : PayGate nous le renvoie dans le rappel
      description: `GRADE HUB ${referenceDemande}`,
    })
    return await prisma.paiement.update({ where: { id: paiement.id }, data: { referenceExterne: txReference } })
  } catch (err) {
    const message = err instanceof PaygateError ? err.message : "Le paiement n'a pas pu être lancé. Réessayez."
    logger.error({ paiementId: paiement.id, motif: message }, 'Échec du lancement du paiement PayGate')
    await prisma.$transaction(async (tx) => {
      await tx.paiement.update({ where: { id: paiement.id }, data: { statut: 'ECHOUE', motifRefus: message } })
      await journal.enregistrer(tx, paiement.demandeId, { type: 'PAIEMENT_ECHOUE', message })
    })
    throw new HttpError(502, message)
  }
}

export function signatureValide(corps: Buffer, signatureHex: string | undefined) {
  if (!signatureHex) return false
  const attendue = crypto.createHmac('sha256', env.PAYMENT_WEBHOOK_SECRET).update(corps).digest('hex')
  const a = Buffer.from(attendue)
  const b = Buffer.from(signatureHex)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Compare deux chaînes sans fuite de timing (clé de l'URL de rappel PayGate). */
export function cleWebhookValide(cle: string | undefined) {
  if (!env.PAYGATE_WEBHOOK_KEY || !cle) return false
  const a = Buffer.from(env.PAYGATE_WEBHOOK_KEY)
  const b = Buffer.from(cle)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/**
 * Applique le résultat d'un paiement. Atomique : si le webhook, le sondage de la page et la tâche
 * de réconciliation arrivent en même temps, un seul applique le résultat.
 */
export async function appliquerStatut(
  paiement: Paiement,
  statut: 'CONFIRME' | 'ECHOUE' | 'REFUSE',
  motifRefus?: string,
) {
  await prisma.$transaction(async (tx) => {
    const maj = await tx.paiement.updateMany({
      where: { id: paiement.id, statut: 'EN_ATTENTE' },
      data: {
        statut,
        motifRefus: statut === 'CONFIRME' ? null : motifRefus,
        confirmeLe: statut === 'CONFIRME' ? new Date() : null,
      },
    })
    if (maj.count === 0) return // déjà traité : webhook rejoué, sans effet

    await journal.enregistrer(tx, paiement.demandeId, {
      type: `PAIEMENT_${statut}`,
      message: `${paiement.type} · ${paiement.montantXof} F CFA${motifRefus ? ` · ${motifRefus}` : ''}`,
    })
    if (statut === 'CONFIRME' && paiement.type === 'SUIVI') {
      await changerStatut(paiement.demandeId, 'PAYEE', null, 'Paiement confirmé', tx)
    }
  })
  return prisma.paiement.findUnique({ where: { id: paiement.id } })
}

/** Confirmation reçue du webhook signé (mode simulation). */
export async function traiterConfirmation(input: {
  referenceExterne: string
  statut: 'CONFIRME' | 'ECHOUE' | 'REFUSE'
  motifRefus?: string
}) {
  const paiement = await prisma.paiement.findUnique({ where: { referenceExterne: input.referenceExterne } })
  if (!paiement) throw new HttpError(404, 'Paiement inconnu')
  return appliquerStatut(paiement, input.statut, input.motifRefus)
}

const MOTIFS: Record<'ECHOUE' | 'REFUSE', string> = {
  ECHOUE: 'Paiement expiré : non confirmé sur le téléphone',
  REFUSE: 'Paiement annulé par le client',
}

/**
 * Interroge PayGate (source de vérité) et applique le résultat. Le contenu d'un appel de rappel
 * n'est jamais cru tel quel : on revérifie toujours le statut et le montant auprès de PayGate.
 */
export async function synchroniserPaiement(paiementId: string): Promise<Paiement> {
  const paiement = await prisma.paiement.findUnique({ where: { id: paiementId } })
  if (!paiement) throw new HttpError(404, 'Paiement inconnu')
  if (paiement.statut !== 'EN_ATTENTE' || env.PAYMENT_PROVIDER !== 'paygate') return paiement

  const etat = await verifierPaygate(configPaygate(), paiement.id)
  if (etat.statut === 'EN_ATTENTE') return paiement

  if (etat.statut === 'CONFIRME' && etat.montantXof != null && etat.montantXof !== paiement.montantXof) {
    // Montant différent de celui demandé : on ne confirme pas, on garde une trace
    logger.error({ paiementId, attendu: paiement.montantXof, recu: etat.montantXof }, 'Montant PayGate incohérent')
    await journal.enregistrer(prisma, paiement.demandeId, {
      type: 'PAIEMENT_MONTANT_INCOHERENT',
      message: `Attendu ${paiement.montantXof} F CFA, reçu ${etat.montantXof} F CFA`,
    })
    return paiement
  }

  const motif = etat.statut === 'CONFIRME' ? undefined : MOTIFS[etat.statut]
  return (await appliquerStatut(paiement, etat.statut, motif)) ?? paiement
}

/** État d'un paiement pour la famille (la page de paiement l'interroge toutes les quelques secondes). */
export async function statutPaiement(userId: string, paiementId: string) {
  const p = await prisma.paiement.findUnique({
    where: { id: paiementId },
    include: { demande: { select: { userId: true } } },
  })
  if (!p || p.demande.userId !== userId) throw new HttpError(404, 'Paiement introuvable')

  let courant: Paiement = p
  try {
    courant = await synchroniserPaiement(p.id)
  } catch (err) {
    // PayGate momentanément injoignable : on garde l'état connu, le prochain sondage réessaie
    logger.warn({ paiementId, motif: err instanceof Error ? err.message : err }, 'Synchronisation du paiement impossible')
  }
  return { id: courant.id, type: courant.type, statut: courant.statut, motifRefus: courant.motifRefus }
}

/** Consigne manuellement un refus de payer (concierge) avec sa raison. */
export async function consignerRefus(demandeId: string, auteurId: string, motif: string) {
  return prisma.$transaction(async (tx) => {
    const demande = await tx.demande.findUnique({ where: { id: demandeId } })
    if (!demande) throw new HttpError(404, 'Demande introuvable')
    const p = await tx.paiement.create({
      data: {
        demandeId,
        type: 'SUIVI',
        montantXof: demande.fraisSuiviXof + demande.fraisExpressXof,
        operateur: 'TMONEY',
        telephone: '-',
        statut: 'REFUSE',
        motifRefus: motif,
      },
    })
    await journal.enregistrer(tx, demandeId, {
      type: 'PAIEMENT_REFUSE',
      message: motif,
      auteurId,
    })
    return p
  })
}
