import { Router, json, raw, urlencoded } from 'express'
import { env } from '../config/env'
import { asyncHandler } from '../utils/asyncHandler'
import { HttpError } from '../utils/errors'
import { logger } from '../utils/logger'
import {
  cleWebhookValide,
  signatureValide,
  synchroniserPaiement,
  traiterConfirmation,
} from '../services/paiements.service'
import { webhookPaiementSchema } from '../validators/webhook.schema'

const r = Router()

/**
 * Rappel de PayGate Global. URL à renseigner dans le tableau de bord PayGate :
 *   https://<votre-api>/api/webhooks/paiement/paygate?k=<PAYGATE_WEBHOOK_KEY>
 * PayGate ne signe pas ses appels : la clé « k » filtre les appels parasites, et surtout le statut
 * réel est revérifié auprès de PayGate avant tout changement (le contenu du rappel n'est jamais cru).
 * Doit être déclaré avant la route générique « /paiement/:operateur ».
 */
r.post(
  '/paiement/paygate',
  json({ limit: '20kb' }),
  urlencoded({ extended: false, limit: '20kb' }),
  asyncHandler(async (req, res) => {
    if (env.PAYMENT_PROVIDER !== 'paygate') throw new HttpError(404, 'Paiement PayGate non activé')
    if (!cleWebhookValide(typeof req.query.k === 'string' ? req.query.k : undefined)) {
      throw new HttpError(401, 'Clé invalide')
    }
    const identifier = req.body?.identifier
    if (typeof identifier !== 'string' || !identifier) throw new HttpError(422, 'Identifiant manquant')

    try {
      await synchroniserPaiement(identifier)
    } catch (err) {
      // On répond quand même 200 : la page de paiement et la tâche de réconciliation réessaieront
      logger.warn({ identifier, motif: err instanceof Error ? err.message : err }, 'Rappel PayGate : synchronisation différée')
    }
    res.json({ recu: true })
  }),
)

// Mode simulation : corps brut nécessaire pour vérifier la signature HMAC
r.post(
  '/paiement/:operateur',
  raw({ type: 'application/json', limit: '100kb' }),
  asyncHandler(async (req, res) => {
    const corps = req.body as Buffer
    if (!Buffer.isBuffer(corps) || !signatureValide(corps, req.header('x-signature'))) {
      throw new HttpError(401, 'Signature invalide')
    }
    let jsonCorps: unknown
    try {
      jsonCorps = JSON.parse(corps.toString('utf8'))
    } catch {
      throw new HttpError(400, 'JSON invalide')
    }
    const data = webhookPaiementSchema.safeParse(jsonCorps)
    if (!data.success) throw new HttpError(422, 'Webhook invalide')
    await traiterConfirmation(data.data)
    res.json({ recu: true })
  }),
)

export default r
