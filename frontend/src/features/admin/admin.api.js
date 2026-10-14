import { api } from '@/services/api'

export const listerDemandesAdmin = (params) =>
  api.get('/admin/demandes', { params }).then((r) => r.data)

export const changerStatut = (id, statut, message) =>
  api.post(`/admin/demandes/${id}/statut`, { statut, message: message || undefined }).then((r) => r.data)

export const ajouterScan = (id, fichier) => {
  const form = new FormData()
  form.append('scan', fichier)
  return api.post(`/admin/demandes/${id}/scan`, form).then((r) => r.data)
}

export const ajouterDeplacement = (id, message) =>
  api.post(`/admin/demandes/${id}/deplacements`, { message: message || undefined }).then((r) => r.data)

export const definirEnvoi = (id, coutEnvoiXof, adresseEnvoi) =>
  api.post(`/admin/demandes/${id}/envoi`, { coutEnvoiXof, adresseEnvoi }).then((r) => r.data)

export const enregistrerResultat = (id, data) =>
  api.post(`/admin/demandes/${id}/resultat`, data).then((r) => r.data)

export const consignerRefus = (id, motif) =>
  api.post(`/admin/demandes/${id}/refus-paiement`, { motif }).then((r) => r.data)

export const creerEtablissement = (data) =>
  api.post('/admin/etablissements', data).then((r) => r.data)

export const definirDelai = (id, delaiMesureJours) =>
  api.patch(`/admin/etablissements/${id}/delai`, { delaiMesureJours }).then((r) => r.data)

export const lireStats = () => api.get('/admin/stats').then((r) => r.data)
