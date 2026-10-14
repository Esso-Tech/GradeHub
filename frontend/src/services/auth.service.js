import { api } from './api'

export const login = (email, motDePasse) =>
  api.post('/auth/login', { email, motDePasse }).then((r) => r.data)

export const register = (data) => api.post('/auth/register', data).then((r) => r.data)

export const me = () => api.get('/auth/me').then((r) => r.data)

export const mettreAJourProfil = (data) => api.patch('/auth/me', data).then((r) => r.data)

export const supprimerCompte = (motDePasse) =>
  api.delete('/auth/compte', { data: { motDePasse } }).then(() => undefined)
