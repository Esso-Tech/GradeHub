import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBell, IconCap, IconGlobe, IconMail, IconMenu, IconSearch } from '@/components/ui/Icons'
import { useAuth } from '@/hooks/useAuth'

function initials(nom) {
  if (!nom) return 'GH'
  const parts = nom.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const ROLE_LABEL = { FAMILLE: 'Famille', ADMIN: 'Administrateur' }

export default function TopBar({ onMenuOpen, badgeCount = 0 }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function onSearch(e) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    if (user?.role === 'ADMIN') {
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

  return (
    <header className="topbar">
      <button type="button" className="topbar-menu-btn" onClick={onMenuOpen} aria-label="Ouvrir le menu">
        <IconMenu />
      </button>
      <div className="topbar-welcome">
        <IconCap className="welcome-cap" />
        <span>Bienvenue sur GRADE HUB</span>
      </div>
      <form className="topbar-search" onSubmit={onSearch} role="search">
        <IconSearch />
        <input
          type="search"
          placeholder="Rechercher une demande, un élève…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Rechercher"
        />
      </form>
      <div className="topbar-actions">
        <div className="topbar-lang" title="Langue">
          <IconGlobe size={18} />
          <span>Français</span>
        </div>
        <button type="button" className="topbar-icon-btn" aria-label="Notifications">
          <IconBell size={20} />
          {badgeCount > 0 && <span className="topbar-badge">{badgeCount}</span>}
        </button>
        <button type="button" className="topbar-icon-btn" aria-label="Messages">
          <IconMail size={20} />
        </button>
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
