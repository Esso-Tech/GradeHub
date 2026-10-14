import { logger } from '../utils/logger'

/** SIMULATION. Brancher un fournisseur SMS (agrégateur local ou international). */
export async function envoyerSms(destinataire: string, contenu: string) {
  logger.info({ destinataire, contenu }, '[SIMULATION] SMS')
  return true
}
