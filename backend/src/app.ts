import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import routes from './routes'
import paiementWebhook from './webhooks/paiement.webhook'
import { errorHandler, notFound } from './middlewares/error.middleware'
import { limiteApi } from './middlewares/rateLimit.middleware'

export const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }))

// Webhooks avant express.json() : ils ont besoin du corps brut
app.use('/api/webhooks', paiementWebhook)

app.use(express.json({ limit: '100kb' }))
app.use('/api', limiteApi, routes)

app.use(notFound)
app.use(errorHandler)
