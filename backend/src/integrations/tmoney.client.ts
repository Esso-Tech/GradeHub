import { logger } from '../utils/logger'

export interface InitierPaiementInput {
  montantXof: number
  telephone: string
  reference: string
}

/**
 * SIMULATION. Remplacer par l'API réelle de T-Money (Togocom) : le contrat
 * (authentification, endpoints, format du webhook) doit être obtenu auprès de l'opérateur.
 */
export async function initierPaiementTMoney(input: InitierPaiementInput) {
  logger.info({ ...input }, '[SIMULATION] T-Money : demande de paiement')
  return { referenceExterne: `TMONEY-${input.reference}` }
}
