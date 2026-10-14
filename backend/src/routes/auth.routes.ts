import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { validate } from '../middlewares/validate.middleware'
import { authRequise } from '../middlewares/auth.middleware'
import { limiteAuth } from '../middlewares/rateLimit.middleware'
import { loginSchema, registerSchema } from '../validators/auth.schema'
import * as c from '../controllers/auth.controller'

const r = Router()
r.post('/register', limiteAuth, validate(registerSchema), asyncHandler(c.register))
r.post('/login', limiteAuth, validate(loginSchema), asyncHandler(c.login))
r.get('/me', authRequise, asyncHandler(c.me))
export default r
