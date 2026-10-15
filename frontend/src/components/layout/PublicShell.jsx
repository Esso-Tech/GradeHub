import { Link, Outlet, useLocation } from 'react-router-dom'
import { IconCap } from '@/components/ui/Icons'

const NAV = [
  { to: '/tarifs', label: 'Tarifs' },
  { to: '/connexion', label: 'Connexion', className: 'public-nav-muted' },
]

export default function PublicShell() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <div className="public-shell">
      <header className="public-top">
        <Link to="/" className="public-brand">
          <IconCap className="brand-cap" size={24} />
          <span>GRADE HUB</span>
        </Link>
        <nav className="public-nav" aria-label="Navigation publique">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={item.className}
              aria-current={pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/inscription" className="public-nav-cta">
            Faire une demande
          </Link>
        </nav>
      </header>
      <main className={`public-main public-main--fluid${onHome ? ' public-main--landing' : ''} animate-in`}>
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="public-footer__inner">
          <p className="public-footer__tagline">
            Suivi de documents scolaires à Lomé · CEPD, BEPC, relevés de notes
          </p>
          <nav className="public-footer__nav" aria-label="Pied de page">
            <Link to="/tarifs">Tarifs</Link>
            <Link to="/inscription">Inscription</Link>
            <Link to="/connexion">Connexion</Link>
          </nav>
          <p className="public-footer__copy">© {new Date().getFullYear()} GRADE HUB</p>
        </div>
      </footer>
    </div>
  )
}
