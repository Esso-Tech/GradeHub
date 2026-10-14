import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function RoleRoute({ role }) {
  const { user } = useAuth()
  if (user?.role !== role) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/famille'} replace />
  }
  return <Outlet />
}
