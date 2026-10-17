import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { validate } from '../middlewares/validate.middleware'
import { limiteContact } from '../middlewares/rateLimit.middleware'
import { messageContactSchema } from '../validators/site.schema'
import * as c from '../controllers/site.controller'

const r = Router()
r.get('/site', asyncHandler(c.lire))
r.post('/contact', limiteContact, validate(messageContactSchema), asyncHandler(c.envoyerMessage))
export default r
