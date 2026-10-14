import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  FRAIS_SUIVI_XOF: z.coerce.number().int().positive().default(1500),
  // 0 = formule express indisponible (prix à fixer)
  FRAIS_EXPRESS_XOF: z.coerce.number().int().min(0).default(0),
  MAJORATION_ANCIEN_POURCENT: z.coerce.number().min(0).default(50),
  ANCIENNETE_SEUIL_ANNEES: z.coerce.number().int().min(1).default(2),

  STORAGE_DIR: z.string().default('./uploads'),
  SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(600),
  RETENTION_SCANS_JOURS: z.coerce.number().int().positive().default(30),

  PAYMENT_WEBHOOK_SECRET: z.string().min(8),

  NOTIFICATIONS_ENABLED: z.enum(['true', 'false']).default('true'),
  NOTIF_CANAL: z.enum(['SMS', 'WHATSAPP']).default('WHATSAPP'),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Configuration invalide :', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
