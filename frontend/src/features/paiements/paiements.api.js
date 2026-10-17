import { api } from '@/services/api'

export const initierPaiement = (data) => api.post('/paiements', data).then((r) => r.data)

/** État d'un paiement ({ statut: EN_ATTENTE | CONFIRME | ECHOUE | REFUSE, motifRefus }). */
export const statutPaiement = (id) => api.get(`/paiements/${id}/statut`).then((r) => r.data)
