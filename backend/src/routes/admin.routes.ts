import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { validate } from '../middlewares/validate.middleware'
import { authRequise } from '../middlewares/auth.middleware'
import { roleRequis } from '../middlewares/role.middleware'
import { uploadScan } from '../middlewares/upload.middleware'
import {
  delaiSchema, envoiSchema, etablissementSchema, refusSchema, resultatSchema, statutSchema,
} from '../validators/admin.schema'
import * as admin from '../controllers/admin.controller'
import * as etab from '../controllers/etablissements.controller'
import * as site from '../controllers/site.controller'
import { contactSchema, luSchema, servicesSchema } from '../validators/site.schema'

const r = Router()
r.use(authRequise, roleRequis('ADMIN'))

r.get('/demandes', asyncHandler(admin.listerDemandes))
r.post('/demandes/:id/statut', validate(statutSchema), asyncHandler(admin.changerStatut))
r.post('/demandes/:id/scan', uploadScan, asyncHandler(admin.ajouterScan))
r.post('/demandes/:id/deplacements', asyncHandler(admin.ajouterDeplacement))
r.post('/demandes/:id/envoi', validate(envoiSchema), asyncHandler(admin.definirEnvoi))
r.post('/demandes/:id/resultat', validate(resultatSchema), asyncHandler(admin.enregistrerResultat))
r.post('/demandes/:id/refus-paiement', validate(refusSchema), asyncHandler(admin.consignerRefus))

r.post('/etablissements', validate(etablissementSchema), asyncHandler(etab.creer))
r.patch('/etablissements/:id/delai', validate(delaiSchema), asyncHandler(etab.definirDelai))

r.put('/site/contact', validate(contactSchema), asyncHandler(site.majContact))
r.put('/site/services', validate(servicesSchema), asyncHandler(site.majServices))
r.get('/messages', asyncHandler(site.messages))
r.patch('/messages/:id', validate(luSchema), asyncHandler(site.marquerMessage))

r.get('/stats', asyncHandler(admin.stats))
export default r
