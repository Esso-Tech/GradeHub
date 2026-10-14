import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="pwa-bar" role="alert">
      <p>Une nouvelle version est disponible.</p>
      <div className="pwa-actions">
        <button className="pwa-btn" onClick={() => updateServiceWorker(true)}>
          Mettre à jour
        </button>
        <button className="pwa-link" onClick={() => setNeedRefresh(false)}>
          Plus tard
        </button>
      </div>
    </div>
  )
}
