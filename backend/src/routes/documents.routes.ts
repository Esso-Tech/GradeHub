import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { authRequise } from '../middlewares/auth.middleware'
import * as c from '../controllers/documents.controller'

const r = Router()
r.get('/demande/:demandeId/lien', authRequise, asyncHandler(c.lien))
// Le jeton signé tient lieu d'authentification : durée de vie courte
r.get('/fichier/:token', asyncHandler(c.fichier))
export default r
