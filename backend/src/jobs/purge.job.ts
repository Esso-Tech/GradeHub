import cron from 'node-cron'
import { purgerScansExpires } from '../services/documents.service'
import { logger } from '../utils/logger'

/** Supprime chaque nuit les scans des demandes clôturées depuis plus de RETENTION_SCANS_JOURS. */
export function planifierPurge() {
  cron.schedule('30 2 * * *', () => {
    purgerScansExpires()
      .then((n) => logger.info({ n }, 'Scans supprimés'))
      .catch((err) => logger.error({ err }, 'Échec de la purge'))
  })
}
