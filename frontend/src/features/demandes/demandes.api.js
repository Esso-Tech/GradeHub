import { api } from '@/services/api'

export const devis = (params) => api.get('/demandes/devis', { params }).then((r) => r.data)
export const creerDemande = (data) => api.post('/demandes', data).then((r) => r.data)
export const mesDemandes = () => api.get('/demandes').then((r) => r.data)
export const lireDemande = (id) => api.get(`/demandes/${id}`).then((r) => r.data)
export const lienScan = (id) => api.get(`/documents/demande/${id}/lien`).then((r) => r.data)
