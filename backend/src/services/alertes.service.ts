import { env } from '../config/env'
import { logger } from '../utils/logger'
import { construireEmailNouveauMessage, emailDeReponse, type MessageContactMail } from './mail.templates'
import { envoyerEmail } from './mail.service'
import { lireSite } from './site.service'

/** Alerte l'administrateur par e-mail à chaque nouveau message de la page Contact. */
export async function alerterNouveauMessage(m: MessageContactMail) {
  try {
    // Destinataire : variable d'environnement, sinon l'e-mail saisi dans « Contenu du site »
    const destinataire = env.ADMIN_NOTIFY_EMAIL ?? (await lireSite()).contact.email
    if (!destinataire) {
      logger.info('Alerte e-mail ignorée : aucun destinataire (ADMIN_NOTIFY_EMAIL ou e-mail du site)')
      return
    }
    const base = (env.APP_URL ?? env.CORS_ORIGIN.split(',')[0]).replace(/\/$/, '')
    const { subject, text, html } = construireEmailNouveauMessage(m, `${base}/admin/messages`)
    await envoyerEmail({ to: destinataire, subject, text, html, replyTo: emailDeReponse(m.contact) })
  } catch (err) {
    logger.error({ err: err instanceof Error ? err.message : err }, "Échec de l'alerte e-mail")
  }
}
