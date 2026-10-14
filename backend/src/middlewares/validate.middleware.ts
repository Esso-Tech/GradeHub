import type { NextFunction, Request, Response } from 'express'
import type { ZodTypeAny } from 'zod'
import { HttpError } from '../utils/errors'

export const validate =
  (schema: ZodTypeAny, source: 'body' | 'query' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const r = schema.safeParse(req[source])
    if (!r.success) return next(new HttpError(422, 'Données invalides', r.error.flatten().fieldErrors))
    ;(req as any)[source] = r.data
    next()
  }
