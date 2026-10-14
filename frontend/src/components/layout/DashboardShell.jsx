import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Breadcrumbs from './Breadcrumbs'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { breadcrumbsForPath } from './nav-config'

export default function DashboardShell() {
  const { user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const crumbs = breadcrumbsForPath(location.pathname)

  return (
    <div className="app-shell">
      <Sidebar
        role={user.role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <TopBar onMenuOpen={() => setSidebarOpen(true)} badgeCount={0} />
        <div className="app-content">
          <Breadcrumbs items={crumbs} />
          <div className="page-dashboard animate-in">
            <Outlet />
          </div>
        </div>
        <footer className="app-footer">
          © GRADE HUB · Suivi documentaire scolaire · Lomé
        </footer>
      </div>
    </div>
  )
}
