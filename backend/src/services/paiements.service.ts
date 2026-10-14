import crypto from 'node:crypto'
import type { Operateur, TypePaiement } from '@prisma/client'
import { prisma } from '../config/db'
import { env } from '../config/env'
import { HttpError } from '../utils/errors'
import { initierPaiementTMoney } from '../integrations/tmoney.client'
import { initierPaiementFlooz } from '../integrations/flooz.client'
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

  const initier = input.operateur === 'TMONEY' ? initierPaiementTMoney : initierPaiementFlooz
  const { referenceExterne } = await initier({
    montantXof: montant,
    telephone: input.telephone,
    reference: paiement.id,
  })

  return prisma.paiement.update({ where: { id: paiement.id }, data: { referenceExterne } })
}

export function signatureValide(corps: Buffer, signatureHex: string | undefined) {
  if (!signatureHex) return false
  const attendue = crypto.createHmac('sha256', env.PAYMENT_WEBHOOK_SECRET).update(corps).digest('hex')
  const a = Buffer.from(attendue)
  const b = Buffer.from(signatureHex)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function traiterConfirmation(input: {
  referenceExterne: string
  statut: 'CONFIRME' | 'ECHOUE' | 'REFUSE'
  motifRefus?: string
}) {
  const paiement = await prisma.paiement.findUnique({ where: { referenceExterne: input.referenceExterne } })
  if (!paiement) throw new HttpError(404, 'Paiement inconnu')
  if (paiement.statut !== 'EN_ATTENTE') return paiement // webhook rejoué : sans effet

  await prisma.$transaction(async (tx) => {
    await tx.paiement.update({
      where: { id: paiement.id },
      data: {
        statut: input.statut,
        motifRefus: input.statut === 'CONFIRME' ? null : input.motifRefus,
        confirmeLe: input.statut === 'CONFIRME' ? new Date() : null,
      },
    })
    await journal.enregistrer(tx, paiement.demandeId, {
      type: `PAIEMENT_${input.statut}`,
      message: `${paiement.type} · ${paiement.montantXof} F CFA${input.motifRefus ? ` · ${input.motifRefus}` : ''}`,
    })
    if (input.statut === 'CONFIRME' && paiement.type === 'SUIVI') {
      await changerStatut(paiement.demandeId, 'PAYEE', null, 'Paiement confirmé', tx)
    }
  })
  return prisma.paiement.findUnique({ where: { id: paiement.id } })
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
