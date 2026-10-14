import { z } from 'zod'

export const statutSchema = z.object({
  statut: z.enum([
    'EN_ATTENTE_PAIEMENT', 'PAYEE', 'DEPOSEE_ETABLISSEMENT', 'PIECE_MANQUANTE', 'EN_COURS',
    'SIGNEE', 'SCAN_ENVOYE', 'ORIGINAL_ENVOYE', 'CLOTUREE', 'ANNULEE',
  ]),
  message: z.string().trim().max(500).optional(),
})

export const envoiSchema = z.object({
  coutEnvoiXof: z.number().int().positive(),
  adresseEnvoi: z.string().trim().min(5).max(300),
})

export const resultatSchema = z.object({
  echeanceTenue: z.boolean(),
  pieceRemplacementSuffisante: z.boolean().optional(),
})

export const refusSchema = z.object({
  motif: z.string().trim().min(3).max(300),
})

export const etablissementSchema = z.object({
  nom: z.string().trim().min(2).max(150),
  type: z.enum(['PUBLIC', 'PRIVE']),
  ville: z.string().trim().default('Lomé'),
  contact: z.string().trim().optional(),
  accordCadreSigne: z.boolean().default(false),
})

export const delaiSchema = z.object({
  delaiMesureJours: z.number().int().positive().nullable(),
})
