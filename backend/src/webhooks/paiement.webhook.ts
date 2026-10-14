import { Router, raw } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { HttpError } from '../utils/errors'
import { signatureValide, traiterConfirmation } from '../services/paiements.service'
import { webhookPaiementSchema } from '../validators/webhook.schema'

const r = Router()

// Corps brut nécessaire pour vérifier la signature HMAC
r.post(
  '/paiement/:operateur',
  raw({ type: 'application/json', limit: '100kb' }),
  asyncHandler(async (req, res) => {
    const corps = req.body as Buffer
    if (!Buffer.isBuffer(corps) || !signatureValide(corps, req.header('x-signature'))) {
      throw new HttpError(401, 'Signature invalide')
    }
    let json: unknown
    try {
      json = JSON.parse(corps.toString('utf8'))
    } catch {
      throw new HttpError(400, 'JSON invalide')
    }
    const data = webhookPaiementSchema.safeParse(json)
    if (!data.success) throw new HttpError(422, 'Webhook invalide')
    await traiterConfirmation(data.data)
    res.json({ recu: true })
  }),
)

export default r
