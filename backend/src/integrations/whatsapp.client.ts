import { logger } from '../utils/logger'

/** SIMULATION. Brancher WhatsApp Business (API Cloud) avec des modèles de message approuvés. */
export async function envoyerWhatsApp(destinataire: string, contenu: string) {
  logger.info({ destinataire, contenu }, '[SIMULATION] WhatsApp')
  return true
}
