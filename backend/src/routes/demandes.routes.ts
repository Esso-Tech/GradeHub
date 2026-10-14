import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { validate } from '../middlewares/validate.middleware'
import { authRequise } from '../middlewares/auth.middleware'
import { roleRequis } from '../middlewares/role.middleware'
import { creerDemandeSchema, devisSchema } from '../validators/demandes.schema'
import * as c from '../controllers/demandes.controller'

const r = Router()
r.use(authRequise)
r.get('/devis', validate(devisSchema, 'query'), asyncHandler(c.devis))
r.post('/', roleRequis('FAMILLE'), validate(creerDemandeSchema), asyncHandler(c.creer))
r.get('/', roleRequis('FAMILLE'), asyncHandler(c.mesDemandes))
r.get('/:id', asyncHandler(c.detail))
export default r
