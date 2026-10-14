import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
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

  const titre = type === 'SUIVI' ? 'Payer le suivi' : "Payer l'envoi"

  return (
    <div className="dashboard-layout page--narrow">
      <PageHeader
        title={titre}
        description={`Demande ${d.reference}`}
        actions={<Link className="btn btn-secondary btn-sm" to={`/famille/demandes/${id}`}>Retour</Link>}
      />

      {dejaPaye && !attente ? (
        <WidgetCard title="Paiement réglé">
          <Notice tone="success">Ce paiement est déjà enregistré.</Notice>
          <Link className="btn btn-primary" to={`/famille/demandes/${id}`}>Voir ma demande</Link>
        </WidgetCard>
      ) : type === 'ENVOI' && !d.coutEnvoiXof ? (
        <WidgetCard title="Envoi">
          <Notice tone="info">Le coût d&apos;envoi n&apos;est pas encore défini. Nous vous prévenons dès qu&apos;il l&apos;est.</Notice>
        </WidgetCard>
      ) : attente ? (
        <WidgetCard title="Confirmation mobile money" description="En attente de validation sur votre téléphone.">
          <p role="status">
            Une demande de {formatXof(montant)} vient d&apos;être envoyée. Validez-la avec votre code.
            Cette page se met à jour dès réception du paiement.
          </p>
          <p className="hint">Rien ne se passe après quelques minutes ? Vérifiez votre solde, puis réessayez.</p>
          <button type="button" className="btn-link" onClick={() => setAttente(false)}>
            Réessayer le paiement
          </button>
        </WidgetCard>
      ) : (
        <WidgetCard title="Montant à régler">
          <p className="pay-amount">{formatXof(montant)}</p>
          {type === 'SUIVI' && (
            <p className="hint">L&apos;envoi de l&apos;original est facturé en plus, au coût réel.</p>
          )}
          <Notice>{erreur}</Notice>
          <MobileMoneyForm montantLabel={formatXof(montant)} onSubmit={payer} loading={occupe} />
        </WidgetCard>
      )}
    </div>
  )
}
