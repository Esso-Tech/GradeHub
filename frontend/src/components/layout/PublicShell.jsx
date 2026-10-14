import { Link, Outlet } from 'react-router-dom'
import { IconCap } from '@/components/ui/Icons'

export default function PublicShell() {
  return (
    <div className="public-shell">
      <header className="public-top">
        <Link to="/" className="public-brand">
          <IconCap className="brand-cap" size={24} />
          <span>GRADE HUB</span>
        </Link>
        <nav className="public-nav" aria-label="Navigation publique">
          <Link to="/tarifs">Tarifs</Link>
          <Link to="/connexion" className="public-nav-cta">
            Se connecter
          </Link>
        </nav>
      </header>
      <main className="public-main animate-in">
        <Outlet />
      </main>
      <footer className="public-footer">
        © GRADE HUB
      </footer>
    </div>
  )
}
