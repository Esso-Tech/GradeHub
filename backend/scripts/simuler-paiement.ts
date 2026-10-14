/**
 * Simule le webhook d'un opérateur (signé HMAC), car T-Money et Flooz sont simulés.
 *
 *   npm run paiement:simuler -- <referenceExterne> [CONFIRME|ECHOUE|REFUSE] [motif]
 *
 * La référence s'obtient dans la réponse de POST /api/paiements (champ referenceExterne).
 */
import 'dotenv/config'
import crypto from 'node:crypto'

const [referenceExterne, statut = 'CONFIRME', ...reste] = process.argv.slice(2)
const secret = process.env.PAYMENT_WEBHOOK_SECRET
const base = process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 4000}`

if (!referenceExterne || !secret) {
  console.error('Usage : npm run paiement:simuler -- <referenceExterne> [CONFIRME|ECHOUE|REFUSE] [motif]')
  console.error('PAYMENT_WEBHOOK_SECRET doit être défini dans .env')
  process.exit(1)
}

const corps = JSON.stringify({
  referenceExterne,
  statut,
  motifRefus: reste.length ? reste.join(' ') : undefined,
})
const signature = crypto.createHmac('sha256', secret).update(corps).digest('hex')

fetch(`${base}/api/webhooks/paiement/tmoney`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-signature': signature },
  body: corps,
})
  .then(async (r) => console.log(r.status, await r.text()))
  .catch((e) => { console.error(e); process.exit(1) })
