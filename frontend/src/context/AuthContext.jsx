import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getToken, setToken } from '@/services/api'
import * as authService from '@/services/auth.service'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!getToken())

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Restaure la session au chargement
  useEffect(() => {
    if (!getToken()) return
    authService
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  // Déconnexion déclenchée par l'intercepteur (jeton expiré)
  useEffect(() => {
    window.addEventListener('gradehub:logout', logout)
    return () => window.removeEventListener('gradehub:logout', logout)
  }, [logout])

  const login = useCallback(async (email, motDePasse) => {
    const { token, user } = await authService.login(email, motDePasse)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (data) => {
    const { token, user } = await authService.register(data)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const supprimerCompte = useCallback(async (motDePasse) => {
    await authService.supprimerCompte(motDePasse)
    setToken(null)
    setUser(null)
  }, [])

  const mettreAJourProfil = useCallback(async (data) => {
    const updated = await authService.mettreAJourProfil(data)
    setUser(updated)
    return updated
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, supprimerCompte, mettreAJourProfil }),
    [user, loading, login, register, logout, supprimerCompte, mettreAJourProfil],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
