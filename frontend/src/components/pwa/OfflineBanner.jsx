import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div className="pwa-offline" role="status">
      Vous êtes hors connexion. L'état de vos demandes s'affichera dès le retour du réseau.
    </div>
  )
}
