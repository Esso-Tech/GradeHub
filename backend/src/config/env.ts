import 'dotenv/config'
import { z } from 'zod'

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    // Adresse publique du site (liens dans les e-mails). Par défaut : première origine CORS.
    APP_URL: z.string().url().optional(),

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

    // --- Paiement mobile ---
    // « simulation » : aucun argent ne bouge (développement). « paygate » : T-Money et Flooz via PayGate Global.
    PAYMENT_PROVIDER: z.enum(['simulation', 'paygate']).default('simulation'),
    PAYMENT_WEBHOOK_SECRET: z.string().min(8), // webhook signé du mode simulation
    PAYGATE_AUTH_TOKEN: z.string().min(8).optional(),
    PAYGATE_BASE_URL: z.string().url().default('https://paygateglobal.com'),
    PAYGATE_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
    // Clé ajoutée à l'URL de rappel (?k=...) : PayGate ne signe pas ses appels
    PAYGATE_WEBHOOK_KEY: z.string().min(16).optional(),

    NOTIFICATIONS_ENABLED: z.enum(['true', 'false']).default('true'),
    NOTIF_CANAL: z.enum(['SMS', 'WHATSAPP']).default('WHATSAPP'),

    // --- E-mail (alertes à l'administrateur) ---
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_SECURE: z.enum(['true', 'false']).default('false'), // true = SSL direct (port 465)
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().optional(), // ex. GRADE HUB <contact@votre-domaine.tg>
    // Destinataire des alertes. À défaut : l'e-mail saisi dans « Contenu du site » (coordonnées).
    ADMIN_NOTIFY_EMAIL: z.string().email().optional(),
  })
  .superRefine((e, ctx) => {
    if (e.PAYMENT_PROVIDER === 'paygate') {
      if (!e.PAYGATE_AUTH_TOKEN) {
        ctx.addIssue({ code: 'custom', path: ['PAYGATE_AUTH_TOKEN'], message: 'Requis avec PAYMENT_PROVIDER=paygate' })
      }
      if (!e.PAYGATE_WEBHOOK_KEY) {
        ctx.addIssue({ code: 'custom', path: ['PAYGATE_WEBHOOK_KEY'], message: 'Requis avec PAYMENT_PROVIDER=paygate (16 caractères minimum)' })
      }
    }
    if (e.SMTP_HOST && !e.MAIL_FROM) {
      ctx.addIssue({ code: 'custom', path: ['MAIL_FROM'], message: 'Requis quand SMTP_HOST est défini' })
    }
  })

// Une variable vide (« SMTP_HOST= ») est considérée comme absente
const propre = Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== undefined && v !== ''))

const parsed = schema.safeParse(propre)
if (!parsed.success) {
  console.error('Configuration invalide :', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
