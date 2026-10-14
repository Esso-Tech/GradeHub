import { api } from '@/services/api'

export const listerEtablissements = () => api.get('/etablissements').then((r) => r.data)
