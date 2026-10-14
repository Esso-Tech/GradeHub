import type { Request, Response } from 'express'
import { prisma } from '../config/db'
import { HttpError } from '../utils/errors'
import * as demandes from '../services/demandes.service'
import * as documents from '../services/documents.service'
import * as paiements from '../services/paiements.service'
import { calculerStats } from '../services/stats.service'

export async function listerDemandes(req: Request, res: Response) {
  const { statut, etablissementId } = req.query as Record<string, string | undefined>
  const items = await prisma.demande.findMany({
    where: {
      ...(statut ? { statut: statut as any } : {}),
      ...(etablissementId ? { etablissementId } : {}),
    },
    include: { etablissement: { select: { nom: true } }, user: { select: { nom: true, telephone: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  res.json(items)
}

export async function changerStatut(req: Request, res: Response) {
  res.json(await demandes.changerStatut(req.params.id, req.body.statut, req.user!.id, req.body.message))
}

export async function ajouterScan(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, 'Fichier manquant (champ « scan »)')
  const doc = await documents.enregistrerScan(req.params.id, req.user!.id, req.file)
  res.status(201).json(doc)
}

export async function ajouterDeplacement(req: Request, res: Response) {
  res.json(await demandes.enregistrerDeplacement(req.params.id, req.user!.id, req.body?.message))
}

export async function definirEnvoi(req: Request, res: Response) {
  res.json(await demandes.definirEnvoi(req.params.id, req.user!.id, req.body.coutEnvoiXof, req.body.adresseEnvoi))
}

export async function enregistrerResultat(req: Request, res: Response) {
  res.json(await demandes.cloturerResultats(req.params.id, req.user!.id, req.body))
}

export async function consignerRefus(req: Request, res: Response) {
  res.status(201).json(await paiements.consignerRefus(req.params.id, req.user!.id, req.body.motif))
}

export async function stats(_req: Request, res: Response) {
  res.json(await calculerStats())
}
