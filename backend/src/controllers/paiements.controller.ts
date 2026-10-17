import type { Request, Response } from 'express'
import * as service from '../services/paiements.service'

export async function initier(req: Request, res: Response) {
  const p = await service.initierPaiement(req.user!.id, req.body)
  res.status(201).json(p)
}

export async function statut(req: Request, res: Response) {
  res.json(await service.statutPaiement(req.user!.id, req.params.id))
}
