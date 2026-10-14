import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { breadcrumbsForPath } from './nav-config'

export default function DashboardShell({ shell }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const crumbs = breadcrumbsForPath(location.pathname, shell.variant)

  return (
    <div className={`app-shell app-shell--${shell.variant}`}>
      <Sidebar
        shell={shell}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <TopBar shell={shell} onMenuOpen={() => setSidebarOpen(true)} />
        <div className="app-content">
          <Breadcrumbs items={crumbs} />
          <div className="page-dashboard animate-in">
            <Outlet />
          </div>
        </div>
        <footer className="app-footer">{shell.footer}</footer>
      </div>
    </div>
  )
}
