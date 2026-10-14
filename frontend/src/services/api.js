import axios from 'axios'

const TOKEN_KEY = 'gradehub:token'

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch { /* stockage indisponible */ }
}

// Origine de l'API : vide en dev (proxy Vite), à renseigner en production
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? ''

export const api = axios.create({ baseURL: `${API_ORIGIN}/api`, timeout: 20000 })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Session expirée : on déconnecte (sauf pendant la connexion, où il n'y a pas de jeton)
    if (err.response?.status === 401 && getToken()) {
      setToken(null)
      window.dispatchEvent(new Event('gradehub:logout'))
    }
    return Promise.reject(err)
  },
)

/** Message lisible à partir d'une erreur axios. */
export function messageErreur(err) {
  const data = err?.response?.data
  if (data?.details && typeof data.details === 'object') {
    const premier = Object.values(data.details).flat()[0]
    if (premier) return `${data.erreur} : ${premier}`
  }
  if (data?.erreur) return data.erreur
  if (err?.code === 'ERR_NETWORK') return 'Connexion impossible. Vérifiez votre réseau.'
  return 'Une erreur est survenue. Réessayez.'
}
