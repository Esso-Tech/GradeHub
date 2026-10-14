import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utils/errors'

export const roleRequis =
  (...roles: Array<'FAMILLE' | 'ADMIN'>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(new HttpError(403, 'Accès refusé'))
    next()
  }
