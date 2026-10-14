import type { Request, Response } from 'express'
import { prisma } from '../config/db'

export async function lister(_req: Request, res: Response) {
  const items = await prisma.etablissement.findMany({
    where: { actif: true },
    select: { id: true, nom: true, type: true, ville: true, accordCadreSigne: true, delaiMesureJours: true },
    orderBy: { nom: 'asc' },
  })
  res.json(items)
}

export async function creer(req: Request, res: Response) {
  const e = await prisma.etablissement.create({ data: req.body })
  res.status(201).json(e)
}

/** Met à jour le délai réel mesuré : c'est ce qui permet d'annoncer un délai aux familles. */
export async function definirDelai(req: Request, res: Response) {
  const e = await prisma.etablissement.update({
    where: { id: req.params.id },
    data: { delaiMesureJours: req.body.delaiMesureJours },
  })
  res.json(e)
}
