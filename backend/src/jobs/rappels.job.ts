import cron from 'node-cron'
import { prisma } from '../config/db'
import { STATUTS_TERMINAUX } from '../services/etats'
import { notifierFamille } from '../services/notifications.service'
import * as journal from '../services/journal.service'
import { ajouterJours } from '../utils/dates'
import { logger } from '../utils/logger'

/** Rappel avant la date limite de l'élève : échéance dans les 3 jours, un rappel par 24 h maximum. */
export async function envoyerRappels(now = new Date()) {
  const demandes = await prisma.demande.findMany({
    where: {
      statut: { notIn: STATUTS_TERMINAUX },
      echeanceExterieure: { gte: now, lte: ajouterJours(now, 3) },
    },
  })

  let envoyes = 0
  for (const d of demandes) {
    const dernier = await prisma.journalEvenement.findFirst({
      where: { demandeId: d.id, type: 'RAPPEL_ECHEANCE', createdAt: { gte: ajouterJours(now, -1) } },
    })
    if (dernier) continue
    await notifierFamille(
      d.id,
      `Votre date limite approche (${d.echeanceExterieure!.toLocaleDateString('fr-FR')}). Nous suivons votre demande.`,
    )
    await journal.enregistrer(prisma, d.id, { type: 'RAPPEL_ECHEANCE' })
    envoyes++
  }
  return envoyes
}

export function planifierRappels() {
  cron.schedule('0 8 * * *', () => {
    envoyerRappels().catch((err) => logger.error({ err }, 'Échec des rappels'))
  })
}
