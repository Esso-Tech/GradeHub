import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { validate } from '../middlewares/validate.middleware'
import { authRequise } from '../middlewares/auth.middleware'
import { roleRequis } from '../middlewares/role.middleware'
import { paiementSchema } from '../validators/demandes.schema'
import * as c from '../controllers/paiements.controller'

const r = Router()
r.post('/', authRequise, roleRequis('FAMILLE'), validate(paiementSchema), asyncHandler(c.initier))
r.get('/:id/statut', authRequise, roleRequis('FAMILLE'), asyncHandler(c.statut))
export default r
