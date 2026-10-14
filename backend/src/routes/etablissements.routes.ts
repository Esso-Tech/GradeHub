import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import * as c from '../controllers/etablissements.controller'

const r = Router()
r.get('/', asyncHandler(c.lister))
export default r
