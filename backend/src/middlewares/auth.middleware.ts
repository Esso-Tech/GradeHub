import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { HttpError } from '../utils/errors'

export function authRequise(req: Request, _res: Response, next: NextFunction) {
  const entete = req.headers.authorization
  if (!entete?.startsWith('Bearer ')) return next(new HttpError(401, 'Authentification requise'))
  try {
    const p = jwt.verify(entete.slice(7), env.JWT_SECRET) as { sub: string; role: 'FAMILLE' | 'ADMIN' }
    req.user = { id: p.sub, role: p.role }
    next()
  } catch {
    next(new HttpError(401, 'Session expirée ou invalide'))
  }
}
