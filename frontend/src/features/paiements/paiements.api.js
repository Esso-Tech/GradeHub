import { api } from '@/services/api'

export const initierPaiement = (data) => api.post('/paiements', data).then((r) => r.data)
