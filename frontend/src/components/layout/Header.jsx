import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const LIENS_FAMILLE = [
  { to: '/famille', label: 'Mes demandes', end: true },
  { to: '/famille/nouvelle', label: 'Nouvelle demande' },
]
const LIENS_ADMIN = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/demandes', label: 'Demandes' },
  { to: '/admin/etablissements', label: 'Établissements' },
  { to: '/admin/statistiques', label: 'Statistiques' },
]
const LIENS_PUBLIC = [{ to: '/tarifs', label: 'Tarifs' }]

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const liens = !user ? LIENS_PUBLIC : user.role === 'ADMIN' ? LIENS_ADMIN : LIENS_FAMILLE

  return (
    <header className="header">
      <NavLink to={user ? (user.role === 'ADMIN' ? '/admin' : '/famille') : '/'} className="brand">
        GRADE HUB
      </NavLink>
      <nav aria-label="Navigation principale">
        {liens.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
        ))}
      </nav>
      <div className="header-user">
        {user ? (
          <>
            <span className="header-name">{user.nom}</span>
            <button
              className="pwa-link-dark"
              onClick={() => { logout(); navigate('/') }}
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <NavLink to="/connexion">Se connecter</NavLink>
        )}
      </div>
    </header>
  )
}
