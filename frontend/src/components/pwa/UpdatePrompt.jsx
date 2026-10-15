import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATE_CHECK_MS = 15 * 60 * 1000

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return

      function checkUpdate() {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {})
        }
      }

      checkUpdate()
      window.setInterval(checkUpdate, UPDATE_CHECK_MS)
      document.addEventListener('visibilitychange', checkUpdate)
      window.addEventListener('focus', checkUpdate)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="pwa-bar" role="alert">
      <p>Une nouvelle version est disponible.</p>
      <div className="pwa-actions">
        <button className="pwa-btn" type="button" onClick={() => updateServiceWorker(true)}>
          Mettre à jour
        </button>
        <button className="pwa-link" type="button" onClick={() => setNeedRefresh(false)}>
          Plus tard
        </button>
      </div>
    </div>
  )
}
