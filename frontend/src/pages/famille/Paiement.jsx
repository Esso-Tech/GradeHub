import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import MobileMoneyForm from '@/components/paiement/MobileMoneyForm'
import { useFetch } from '@/hooks/useFetch'
import { lireDemande } from '@/features/demandes/demandes.api'
import { initierPaiement, statutPaiement } from '@/features/paiements/paiements.api'
import { messageErreur } from '@/services/api'
import { OPERATEURS } from '@/utils/constants'
import { formatXof } from '@/utils/format'

const POLL_MS = 4000

export default function Paiement() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const type = params.get('type') === 'ENVOI' ? 'ENVOI' : 'SUIVI'
  const navigate = useNavigate()

  const { data: d, loading, error } = useFetch(() => lireDemande(id), [id])
  const [attente, setAttente] = useState(false)
  const [paiement, setPaiement] = useState(null) // { id, operateur }
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

  // Tant que le client n'a pas validé sur son téléphone, on interroge l'état du paiement
  useEffect(() => {
    if (!attente || !paiement) return
    let annule = false
    const verifier = async () => {
      try {
        const p = await statutPaiement(paiement.id)
        if (annule) return
        if (p.statut === 'CONFIRME') {
          navigate(`/famille/demandes/${id}`, { replace: true })
        } else if (p.statut === 'ECHOUE' || p.statut === 'REFUSE') {
          setAttente(false)
          setPaiement(null)
          setErreur(`${p.motifRefus || "Le paiement n'a pas abouti."} Vous pouvez réessayer.`)
        }
      } catch {
        /* réseau instable : on réessaie au prochain passage */
      }
    }
    const t = setInterval(verifier, POLL_MS)
    return () => { annule = true; clearInterval(t) }
  }, [attente, paiement, id, navigate])

  async function payer({ operateur, telephone }) {
    setOccupe(true)
    setErreur('')
    try {
      const p = await initierPaiement({ demandeId: id, type, operateur, telephone })
      setPaiement({ id: p.id, operateur })
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
            Une demande de {formatXof(montant)} vient d&apos;être envoyée sur votre téléphone
            ({OPERATEURS[paiement?.operateur] ?? 'mobile money'}). Validez-la avec votre code secret.
            Cette page se met à jour dès réception du paiement.
          </p>
          <p className="hint">Rien ne se passe après quelques minutes ? Vérifiez votre solde et le numéro saisi, puis réessayez.</p>
          <button type="button" className="btn-link" onClick={() => { setAttente(false); setPaiement(null) }}>
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
