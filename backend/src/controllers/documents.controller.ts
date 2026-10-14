import type { Request, Response } from 'express'
import { prisma } from '../config/db'
import { lireScan } from '../config/storage'
import { HttpError } from '../utils/errors'
import * as service from '../services/documents.service'

export async function lien(req: Request, res: Response) {
  const demande = await prisma.demande.findUnique({ where: { id: req.params.demandeId } })
  if (!demande || (req.user!.role !== 'ADMIN' && demande.userId !== req.user!.id)) {
    throw new HttpError(404, 'Demande introuvable')
  }
  const { token, expireDansSecondes } = await service.creerLienSigne(demande.id)
  res.json({ url: `/api/documents/fichier/${token}`, expireDansSecondes })
}

export async function fichier(req: Request, res: Response) {
  const doc = await service.documentDepuisToken(req.params.token)
  res.setHeader('Content-Type', doc.mimeType)
  res.setHeader('Content-Disposition', 'inline')
  res.setHeader('Cache-Control', 'private, no-store')
  const flux = lireScan(doc.storageKey)
  // Fichier absent ou illisible : réponse propre plutôt qu'un plantage du serveur
  flux.on('error', () => {
    if (!res.headersSent) res.status(404).json({ erreur: 'Fichier introuvable' })
    else res.destroy()
  })
  flux.pipe(res)
}
