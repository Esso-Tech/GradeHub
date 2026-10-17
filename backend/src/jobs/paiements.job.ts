import cron from 'node-cron'
import { prisma } from '../config/db'
import { env } from '../config/env'
import { appliquerStatut, synchroniserPaiement } from '../services/paiements.service'
import { ajouterJours } from '../utils/dates'
import { logger } from '../utils/logger'

/**
 * Filet de sécurité : si un rappel PayGate est perdu et que la famille a fermé la page,
 * les paiements en attente sont revérifiés, puis expirés après 24 h sans confirmation.
 */
export async function reconcilierPaiements(now = new Date()) {
  if (env.PAYMENT_PROVIDER !== 'paygate') return { verifies: 0, expires: 0 }

  const enAttente = await prisma.paiement.findMany({
    where: { statut: 'EN_ATTENTE', referenceExterne: { not: null }, createdAt: { gte: ajouterJours(now, -1) } },
  })
  let verifies = 0
  for (const p of enAttente) {
    try {
      await synchroniserPaiement(p.id)
      verifies++
    } catch (err) {
      logger.warn({ paiementId: p.id, motif: err instanceof Error ? err.message : err }, 'Réconciliation différée')
    }
  }

  const perimes = await prisma.paiement.findMany({
    where: { statut: 'EN_ATTENTE', createdAt: { lt: ajouterJours(now, -1) } },
  })
  for (const p of perimes) await appliquerStatut(p, 'ECHOUE', 'Expiré sans confirmation')

  return { verifies, expires: perimes.length }
}

export function planifierReconciliation() {
  cron.schedule('*/5 * * * *', () => {
    reconcilierPaiements().catch((err) => logger.error({ err }, 'Échec de la réconciliation des paiements'))
  })
}
