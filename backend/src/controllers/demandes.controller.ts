import type { Request, Response } from 'express'
import { prisma } from '../config/db'
import { HttpError } from '../utils/errors'
import * as service from '../services/demandes.service'

export async function devis(req: Request, res: Response) {
  const q = req.query as unknown as { etablissementId: string; anneeSortie: number; urgence: boolean }
  res.json(await service.devis(q.etablissementId, q.anneeSortie, q.urgence))
}

export async function creer(req: Request, res: Response) {
  const demande = await service.creerDemande(req.user!.id, req.body, req.ip)
  res.status(201).json(demande)
}

export async function mesDemandes(req: Request, res: Response) {
  const items = await prisma.demande.findMany({
    where: { userId: req.user!.id },
    include: { etablissement: { select: { nom: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(items)
}

export async function detail(req: Request, res: Response) {
  const demande = await service.lireDemande(req.params.id)
  if (!demande) throw new HttpError(404, 'Demande introuvable')
  // Une famille ne voit que ses propres demandes
  if (req.user!.role !== 'ADMIN' && demande.userId !== req.user!.id) {
    throw new HttpError(404, 'Demande introuvable')
  }
  res.json(demande)
}
