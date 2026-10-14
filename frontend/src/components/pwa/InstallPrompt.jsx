import { useState } from 'react'
import { usePWAInstall } from '@/hooks/usePWAInstall'

const DISMISS_KEY = 'gradehub:install-dismissed'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

const isIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent)

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export default function InstallPrompt() {
  const { canInstall, install } = usePWAInstall()
  const [hidden, setHidden] = useState(wasDismissed)

  const dismiss = () => {
    setHidden(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* stockage indisponible : on masque seulement pour cette session */
    }
  }

  if (hidden || isStandalone()) return null

  // Android / Chrome / Edge : invite native
  if (canInstall) {
    return (
      <div className="pwa-bar">
        <p>Installez GRADE HUB sur votre téléphone pour suivre vos demandes plus vite.</p>
        <div className="pwa-actions">
          <button className="pwa-btn" onClick={install}>Installer</button>
          <button className="pwa-link" onClick={dismiss}>Plus tard</button>
        </div>
      </div>
    )
  }

  // iPhone : installation manuelle
  if (isIOS()) {
    return (
      <div className="pwa-bar">
        <p>
          Pour installer GRADE HUB : touchez Partager dans Safari, puis
          « Sur l'écran d'accueil ».
        </p>
        <div className="pwa-actions">
          <button className="pwa-link" onClick={dismiss}>Compris</button>
        </div>
      </div>
    )
  }

  return null
}
