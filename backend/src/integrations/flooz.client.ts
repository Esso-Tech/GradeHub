import { logger } from '../utils/logger'
import type { InitierPaiementInput } from './tmoney.client'

/**
 * SIMULATION. Remplacer par l'API réelle de Flooz (Moov Africa) : le contrat
 * doit être obtenu auprès de l'opérateur.
 */
export async function initierPaiementFlooz(input: InitierPaiementInput) {
  logger.info({ ...input }, '[SIMULATION] Flooz : demande de paiement')
  return { referenceExterne: `FLOOZ-${input.reference}` }
}
