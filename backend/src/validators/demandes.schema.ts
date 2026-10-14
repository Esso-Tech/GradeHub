import { z } from 'zod'

const anneeCourante = new Date().getFullYear()

export const devisSchema = z.object({
  etablissementId: z.string().min(1),
  anneeSortie: z.coerce.number().int().min(1990).max(anneeCourante),
  urgence: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
})

export const creerDemandeSchema = z.object({
  etablissementId: z.string().min(1),
  typeDocument: z.enum(['CEPD', 'BEPC', 'RELEVE_NOTES']),
  anneeSortie: z.number().int().min(1990).max(anneeCourante),
  eleveNom: z.string().trim().min(1).max(100),
  elevePrenom: z.string().trim().min(1).max(100),
  dateNaissance: z.coerce.date().optional(),
  urgence: z.boolean().default(false),
  echeanceExterieure: z.coerce.date().optional(),
  motifEcheance: z.string().trim().max(200).optional(),
  mandat: z.object({
    mandantNom: z.string().trim().min(2).max(100),
    // Le mandat est refusé s'il n'est pas explicitement accepté
    consentementDepot: z.literal(true),
    consentementTransmission: z.literal(true),
  }),
})

export const paiementSchema = z.object({
  demandeId: z.string().min(1),
  type: z.enum(['SUIVI', 'ENVOI']),
  operateur: z.enum(['TMONEY', 'FLOOZ']),
  telephone: z.string().trim().regex(/^\+?[0-9 ]{8,15}$/),
})
