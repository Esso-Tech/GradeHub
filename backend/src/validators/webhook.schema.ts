import { z } from 'zod'

export const webhookPaiementSchema = z.object({
  referenceExterne: z.string().min(1),
  statut: z.enum(['CONFIRME', 'ECHOUE', 'REFUSE']),
  motifRefus: z.string().max(300).optional(),
})
