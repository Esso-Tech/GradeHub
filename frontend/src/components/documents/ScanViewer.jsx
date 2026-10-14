import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notice from '@/components/ui/Notice'
import { lienScan } from '@/features/demandes/demandes.api'
import { API_ORIGIN, messageErreur } from '@/services/api'

/** Ouvre le scan via un lien signé de courte durée (jamais mis en cache). */
export default function ScanViewer({ demandeId }) {
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')

  async function ouvrir() {
    setLoading(true)
    setErreur('')
    try {
      const { url } = await lienScan(demandeId)
      window.open(`${API_ORIGIN}${url}`, '_blank', 'noopener')
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={ouvrir} loading={loading}>Voir le scan du document</Button>
      <Notice>{erreur}</Notice>
    </div>
  )
}
