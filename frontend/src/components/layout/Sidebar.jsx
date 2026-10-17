import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { IconMenu, NavIcon } from '@/components/ui/Icons'
import { LogoMark } from '@/components/ui/Logo'
import { NAV_ADMIN, NAV_FAMILLE } from './nav-config'

function NavGroup({ item, onNavigate }) {
  const location = useLocation()
  const childActive = item.children?.some((c) =>
    c.end ? location.pathname === c.to : location.pathname.startsWith(c.to.split('?')[0]),
  )
  const [open, setOpen] = useState(childActive ?? true)

  return (
    <div className={`sidebar-group ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className={`sidebar-link sidebar-link-parent ${childActive ? 'active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <NavIcon name={item.icon} />
        <span>{item.label}</span>
        <span className="sidebar-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="sidebar-sub">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              end={c.end}
              className={({ isActive }) => `sidebar-sublink ${isActive ? 'active' : ''}`}
              onClick={onNavigate}
            >
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function NavItem({ item, onNavigate }) {
  if (item.children) return <NavGroup item={item} onNavigate={onNavigate} />
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      onClick={onNavigate}
    >
      <NavIcon name={item.icon} />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ shell, open, onClose }) {
  const nav = shell.variant === 'admin' ? NAV_ADMIN : NAV_FAMILLE

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label={shell.portalLabel}>
        <div className="sidebar-head">
          <NavLink to={shell.home} className="sidebar-brand" onClick={onClose}>
            <LogoMark size={30} tone="light" />
            <span className="sidebar-brand-name">GRADE HUB</span>
          </NavLink>
          <button type="button" className="sidebar-toggle" onClick={onClose} aria-label="Fermer le menu">
            <IconMenu />
          </button>
        </div>
        <nav className="sidebar-nav">
          {nav.map((item) => (
            <NavItem key={item.id ?? item.to} item={item} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </>
  )
}
