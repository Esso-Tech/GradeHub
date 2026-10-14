import { Router } from 'express'
import auth from './auth.routes'
import etablissements from './etablissements.routes'
import demandes from './demandes.routes'
import paiements from './paiements.routes'
import documents from './documents.routes'
import admin from './admin.routes'

const r = Router()
r.get('/health', (_req, res) => res.json({ ok: true }))
r.use('/auth', auth)
r.use('/etablissements', etablissements)
r.use('/demandes', demandes)
r.use('/paiements', paiements)
r.use('/documents', documents)
r.use('/admin', admin)
export default r
