import type { Request, Response } from 'express'
import * as site from '../services/site.service'
import { alerterNouveauMessage } from '../services/alertes.service'

/** Public : contenu des pages Services et Contact. */
export async function lire(_req: Request, res: Response) {
  res.set('Cache-Control', 'public, max-age=60')
  res.json(await site.lireSite())
}

/** Public : message envoyé depuis la page Contact. */
export async function envoyerMessage(req: Request, res: Response) {
  const { website, ...data } = req.body
  // Un robot a rempli le champ piège : on répond « ok » sans rien enregistrer
  if (!website) {
    const message = await site.creerMessage(data)
    // Alerte e-mail en arrière-plan : la réponse au visiteur n'attend pas l'envoi
    void alerterNouveauMessage(message)
  }
  res.status(201).json({ ok: true })
}

export async function majContact(req: Request, res: Response) {
  res.json(await site.enregistrerContact(req.body))
}

export async function majServices(req: Request, res: Response) {
  res.json(await site.enregistrerServices(req.body))
}

export async function messages(_req: Request, res: Response) {
  res.json(await site.listerMessages())
}

export async function marquerMessage(req: Request, res: Response) {
  res.json(await site.marquerMessage(req.params.id, req.body.lu))
}
