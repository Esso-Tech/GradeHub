import { z } from 'zod'

export const registerSchema = z.object({
  nom: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  telephone: z.string().trim().regex(/^\+?[0-9 ]{8,15}$/, 'Numéro invalide'),
  motDePasse: z.string().min(8).max(100),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  motDePasse: z.string().min(1),
})

export const supprimerCompteSchema = z.object({
  motDePasse: z.string().min(1, 'Mot de passe requis'),
})

export const profilSchema = z.object({
  nom: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  telephone: z.string().trim().regex(/^\+?[0-9 ]{8,15}$/, 'Numéro invalide'),
})
