import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconMenu, IconSearch } from '@/components/ui/Icons'
import { useAuth } from '@/hooks/useAuth'

function initials(nom) {
  if (!nom) return 'GH'
  const parts = nom.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const ROLE_LABEL = { FAMILLE: 'Famille', ADMIN: 'Administrateur' }

const SETTINGS_PATH = { famille: '/famille/parametres', admin: '/admin/parametres' }

export default function TopBar({ shell, onMenuOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const settingsPath = SETTINGS_PATH[shell.variant] ?? '/famille/parametres'

  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  function onSearch(e) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    if (shell.variant === 'admin') {
      navigate(`/admin/demandes?recherche=${encodeURIComponent(term)}`)
      return
    }
    navigate('/famille', { state: { recherche: term } })
  }

  function onLogout() {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  function onSettings() {
    setMenuOpen(false)
    navigate(settingsPath)
  }

  return (
    <header className="topbar">
      <button type="button" className="topbar-menu-btn" onClick={onMenuOpen} aria-label="Ouvrir le menu">
        <IconMenu />
      </button>
      <div className="topbar-welcome">
        <span>{shell.welcome}</span>
      </div>
      <form className="topbar-search" onSubmit={onSearch} role="search">
        <IconSearch />
        <input
          type="search"
          placeholder={
            shell.variant === 'admin'
              ? 'Rechercher une demande, un élève…'
              : 'Rechercher dans mes demandes…'
          }
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Rechercher"
        />
      </form>
      <div className="topbar-actions" ref={menuRef}>
        <div className="topbar-user-wrap">
          <button
            type="button"
            className="topbar-user"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="topbar-avatar">{initials(user?.nom)}</span>
            <span className="topbar-user-text">
              <strong>{user?.nom}</strong>
              <small>{ROLE_LABEL[user?.role] ?? user?.role}</small>
            </span>
            <span className="topbar-user-chevron" aria-hidden="true" />
          </button>
          {menuOpen && (
            <div className="topbar-dropdown" role="menu">
              <button type="button" role="menuitem" onClick={onSettings}>
                Paramètres du compte
              </button>
              <div className="topbar-dropdown__sep" role="separator" />
              <button type="button" role="menuitem" onClick={onLogout}>
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
