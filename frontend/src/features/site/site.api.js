import { api } from '@/services/api'

// Public
export const getSite = () => api.get('/site').then((r) => r.data)
export const envoyerMessage = (data) => api.post('/contact', data).then((r) => r.data)

// Admin
export const enregistrerContact = (data) => api.put('/admin/site/contact', data).then((r) => r.data)
export const enregistrerServices = (data) => api.put('/admin/site/services', data).then((r) => r.data)
export const listerMessages = () => api.get('/admin/messages').then((r) => r.data)
export const marquerMessage = (id, lu) => api.patch(`/admin/messages/${id}`, { lu }).then((r) => r.data)
