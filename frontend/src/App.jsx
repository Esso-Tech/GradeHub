import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import UpdatePrompt from '@/components/pwa/UpdatePrompt'
import OfflineBanner from '@/components/pwa/OfflineBanner'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineBanner />
        <AppRoutes />
        <InstallPrompt />
        <UpdatePrompt />
      </AuthProvider>
    </BrowserRouter>
  )
}
