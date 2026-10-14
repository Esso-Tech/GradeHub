import type { Request, Response } from 'express'
import * as service from '../services/paiements.service'

export async function initier(req: Request, res: Response) {
  const p = await service.initierPaiement(req.user!.id, req.body)
  res.status(201).json(p)
}
