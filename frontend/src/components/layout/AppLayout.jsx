import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import DashboardShell from './DashboardShell'
import PublicShell from './PublicShell'

function useDashboardShell() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  if (!user) return false
  return pathname.startsWith('/famille') || pathname.startsWith('/admin')
}

export default function AppLayout() {
  const dashboard = useDashboardShell()
  if (dashboard) return <DashboardShell />
  return <PublicShell />
}
