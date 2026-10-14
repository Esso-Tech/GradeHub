import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import MobileMoneyForm from '@/components/paiement/MobileMoneyForm'
import { useFetch } from '@/hooks/useFetch'
import { lireDemande } from '@/features/demandes/demandes.api'
import { initierPaiement } from '@/features/paiements/paiements.api'
import { messageErreur } from '@/services/api'
import { formatXof } from '@/utils/format'

const POLL_MS = 5000

export default function Paiement() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const type = params.get('type') === 'ENVOI' ? 'ENVOI' : 'SUIVI'
  const navigate = useNavigate()

  const { data: d, loading, error, reload } = useFetch(() => lireDemande(id), [id])
  const [attente, setAttente] = useState(false)
  const [erreur, setErreur] = useState('')
  const [occupe, setOccupe] = useState(false)

  const montant = d
    ? type === 'SUIVI' ? d.fraisSuiviXof + d.fraisExpressXof : d.coutEnvoiXof
    : 0
  const dejaPaye = d
    ? type === 'SUIVI'
      ? d.statut !== 'EN_ATTENTE_PAIEMENT'
      : d.paiements.some((p) => p.type === 'ENVOI' && p.statut === 'CONFIRME')
    : false

  // Après le lancement du paiement : on vérifie toutes les 5 s si l'opérateur a confirmé
  useEffect(() => {
    if (!attente) return
    const t = setInterval(() => reload(true), POLL_MS)
    return () => clearInterval(t)
  }, [attente, reload])

  useEffect(() => {
    if (attente && dejaPaye) navigate(`/famille/demandes/${id}`, { replace: true })
  }, [attente, dejaPaye, id, navigate])

  async function payer({ operateur, telephone }) {
    setOccupe(true)
    setErreur('')
    try {
      await initierPaiement({ demandeId: id, type, operateur, telephone })
      setAttente(true)
    } catch (err) {
      setErreur(messageErreur(err))
    } finally {
      setOccupe(false)
    }
  }

  if (loading) return <Loader />
  if (error) return <Notice>{error}</Notice>
  if (!d) return null

  return (
    <section className="narrow">
      <h1>{type === 'SUIVI' ? 'Payer le suivi' : "Payer l'envoi"}</h1>

      {dejaPaye && !attente ? (
        <>
          <Notice tone="success">Ce paiement est déjà réglé.</Notice>
          <p><Link to={`/famille/demandes/${id}`}>Voir ma demande</Link></p>
        </>
      ) : type === 'ENVOI' && !d.coutEnvoiXof ? (
        <Notice tone="info">Le coût d'envoi n'est pas encore défini. Nous vous prévenons dès qu'il l'est.</Notice>
      ) : attente ? (
        <div className="card" role="status">
          <h3>Confirmez sur votre téléphone</h3>
          <p>
            Une demande de {formatXof(montant)} vient d'être envoyée. Validez-la avec votre code.
            Cette page se met à jour dès que le paiement est reçu.
          </p>
          <p className="hint">Rien ne s'est passé après quelques minutes ? Vérifiez votre solde, puis réessayez.</p>
          <p><button className="pwa-link-dark" onClick={() => setAttente(false)}>Réessayer le paiement</button></p>
        </div>
      ) : (
        <>
          <div className="card">
            <p>Demande {d.reference}</p>
            <p><strong>{formatXof(montant)}</strong></p>
            {type === 'SUIVI' && <p className="hint">L'envoi de l'original est facturé en plus, au coût réel.</p>}
          </div>
          <Notice>{erreur}</Notice>
          <MobileMoneyForm montantLabel={formatXof(montant)} onSubmit={payer} loading={occupe} />
        </>
      )}
    </section>
  )
}
