import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from '@/components/ui/SiteIcons'
import { SITE_BASE, hasContact, mailLink, telLink, whatsappLink } from '@/config/site'
import { useSite } from '@/hooks/useSite'

const NAV = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

function ContactList({ contact }) {
  const items = [
    contact.phone && { icon: IconPhone, label: contact.phone, href: telLink(contact) },
    contact.whatsapp && { icon: IconWhatsApp, label: `WhatsApp ${contact.whatsapp}`, href: whatsappLink(contact) },
    contact.email && { icon: IconMail, label: contact.email, href: mailLink(contact) },
    { icon: IconPin, label: contact.address ? `${contact.address}, ${SITE_BASE.city}` : SITE_BASE.city },
  ].filter(Boolean)

  return (
    <ul className="footer-contact">
      {items.map(({ icon: Icon, label, href }) => (
        <li key={label}>
          <Icon size={18} />
          {href ? <a href={href} className="footer-contact__key">{label}</a> : <span>{label}</span>}
        </li>
      ))}
    </ul>
  )
}

export default function PublicShell() {
  const { pathname, hash } = useLocation()
  const { contact } = useSite()

  // Chaque page s'ouvre en haut, ou à l'ancre demandée (ex. /services#tarifs)
  useEffect(() => {
    const cible = hash ? document.getElementById(hash.slice(1)) : null
    if (cible) cible.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="site">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" aria-label="GRADE HUB, accueil">
            <Logo />
          </Link>
          <nav className="site-nav" aria-label="Navigation principale">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>{item.label}</NavLink>
            ))}
            <NavLink to="/connexion" className="site-nav__muted">Connexion</NavLink>
            <NavLink to="/inscription" className="site-nav__cta">Créer un compte</NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__grid">
            <div>
              <Logo tone="light" />
              <p className="site-footer__note">
                Nous déposons, suivons et vous livrons vos documents scolaires, à Lomé : CEPD, BEPC et relevés de notes.
              </p>
            </div>
            <div>
              <h3>Navigation</h3>
              <ul>
                {NAV.map((item) => (
                  <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
                ))}
                <li><Link to="/inscription">Créer un compte</Link></li>
                <li><Link to="/connexion">Connexion</Link></li>
              </ul>
            </div>
            <div>
              <h3>Nous contacter</h3>
              {hasContact(contact) ? (
                <ContactList contact={contact} />
              ) : (
                <p className="site-footer__note">
                  Nos coordonnées seront bientôt publiées. En attendant, écrivez-nous depuis la{' '}
                  <Link to="/contact">page Contact</Link>.
                </p>
              )}
            </div>
            <div>
              <h3>Accueil et paiement</h3>
              {contact.hours && (
                <p className="footer-hours"><IconClock size={18} /> {contact.hours}</p>
              )}
              <p className="site-footer__note">Paiement par mobile money : T-Money, Flooz.</p>
            </div>
          </div>
          <div className="site-footer__bottom">
            <span>© {new Date().getFullYear()} GRADE HUB. Tous droits réservés.</span>
            <span>{SITE_BASE.city}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
