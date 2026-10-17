import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '../config/env'
import { logger } from '../utils/logger'

let transporteur: Transporter | null | undefined

function obtenirTransporteur(): Transporter | null {
  if (transporteur !== undefined) return transporteur
  if (!env.SMTP_HOST) return (transporteur = null)
  transporteur = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? '' } : undefined,
  })
  return transporteur
}

export const emailActif = () => obtenirTransporteur() !== null

/** Envoie un e-mail. Ne lève jamais d'erreur : un e-mail raté ne doit pas bloquer le reste. */
export async function envoyerEmail(m: {
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  const t = obtenirTransporteur()
  if (!t) {
    logger.info({ sujet: m.subject }, 'E-mail non envoyé : SMTP non configuré')
    return false
  }
  try {
    await t.sendMail({ from: env.MAIL_FROM, to: m.to, subject: m.subject, text: m.text, html: m.html, replyTo: m.replyTo })
    return true
  } catch (err) {
    logger.error({ err: err instanceof Error ? err.message : err }, "Échec de l'envoi de l'e-mail")
    return false
  }
}
