import { prisma } from '../config/db'
import { env } from '../config/env'
import { envoyerSms } from '../integrations/sms.client'
import { envoyerWhatsApp } from '../integrations/whatsapp.client'
import { logger } from '../utils/logger'

/** Prévient la famille. Un échec d'envoi n'interrompt jamais le traitement de la demande. */
export async function notifierFamille(demandeId: string, contenu: string) {
  if (env.NOTIFICATIONS_ENABLED === 'false') return

  try {
    const demande = await prisma.demande.findUnique({
      where: { id: demandeId },
      include: { user: true },
    })
    if (!demande) return

    const canal = env.NOTIF_CANAL
    const destinataire = demande.user.telephone
    const message = `GRADE HUB ${demande.reference} : ${contenu}`

    const notif = await prisma.notification.create({
      data: { demandeId, canal, destinataire, contenu: message },
    })

    const ok =
      canal === 'WHATSAPP'
        ? await envoyerWhatsApp(destinataire, message)
        : await envoyerSms(destinataire, message)
    if (ok) await prisma.notification.update({ where: { id: notif.id }, data: { envoyee: true } })
  } catch (err) {
    logger.error({ err, demandeId }, 'Échec de notification')
  }
}
