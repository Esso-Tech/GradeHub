import { z } from 'zod'

const court = (max: number) => z.string().trim().max(max).default('')
const numeroOuVide = (max = 30) =>
  z.string().trim().max(max).default('').refine((v) => v === '' || /^\+?[0-9 ()-]{8,20}$/.test(v), 'Numéro invalide')

/** Coordonnées affichées dans le pied de page et sur la page Contact. Un champ vide n'est pas affiché. */
export const contactSchema = z.object({
  phone: numeroOuVide(),
  whatsapp: numeroOuVide(),
  email: z
    .string()
    .trim()
    .max(120)
    .default('')
    .refine((v) => v === '' || z.string().email().safeParse(v).success, 'E-mail invalide'),
  address: court(200),
  hours: court(150),
})

/** Un service : une carte sur la page Services. `important` l'affiche en orange. */
export const serviceSchema = z.object({
  titre: z.string().trim().min(1, 'Titre requis').max(80),
  texte: z.string().trim().min(1, 'Description requise').max(300),
  etiquette: court(40),
  important: z.boolean().default(false),
})

export const servicesSchema = z.object({
  documents: z.array(serviceSchema).max(12),
  inclus: z.array(serviceSchema).max(12),
})

export const messageContactSchema = z.object({
  nom: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(3).max(150),
  sujet: z.string().trim().min(1).max(100),
  message: z.string().trim().min(5).max(2000),
  // Champ piège : invisible pour les humains, rempli par les robots
  website: z.string().max(200).optional(),
})

export const luSchema = z.object({ lu: z.boolean() })

export type ContactSite = z.infer<typeof contactSchema>
export type ServicesSite = z.infer<typeof servicesSchema>
