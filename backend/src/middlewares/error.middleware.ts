import type { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'
import { HttpError } from '../utils/errors'
import { logger } from '../utils/logger'

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ erreur: 'Ressource introuvable' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ erreur: err.message, details: err.details })
  }
  if (err instanceof MulterError) {
    return res.status(413).json({ erreur: 'Fichier trop volumineux (10 Mo maximum)' })
  }
  logger.error({ err }, 'Erreur non gérée')
  res.status(500).json({ erreur: 'Erreur interne' })
}
