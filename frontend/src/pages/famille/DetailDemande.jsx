import { Link, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import StatutBadge from '@/components/ui/StatutBadge'
import WidgetCard from '@/components/ui/WidgetCard'
import StatutTimeline from '@/components/demandes/StatutTimeline'
import JournalList from '@/components/demandes/JournalList'
import ScanViewer from '@/components/documents/ScanViewer'
import { useFetch } from '@/hooks/useFetch'
import { lireDemande } from '@/features/demandes/demandes.api'
import { TYPES_DOCUMENT } from '@/utils/constants'
import { formatDate, formatXof } from '@/utils/format'

export default function DetailDemande() {
  const { id } = useParams()
  const { data: d, loading, error, reload } = useFetch(() => lireDemande(id), [id])

  if (loading) return <Loader />
  if (error) return <Notice>{error}</Notice>
  if (!d) return null

  const suiviPaye = d.statut !== 'EN_ATTENTE_PAIEMENT'
  const envoiAPayer =
    d.coutEnvoiXof && !d.paiements.some((p) => p.type === 'ENVOI' && p.statut === 'CONFIRME')

  return (
    <div className="dashboard-layout">
      <PageHeader
        title={TYPES_DOCUMENT[d.typeDocument]}
        description={`${d.elevePrenom} ${d.eleveNom} · ${d.reference}`}
        actions={
          <>
            <StatutBadge statut={d.statut} />
            <Link className="btn btn-secondary btn-sm" to="/famille">Retour</Link>
          </>
        }
      />

      {!suiviPaye && d.statut !== 'ANNULEE' && (
        <WidgetCard title="Paiement en attente">
          <p>Nous commençons le suivi dès réception de {formatXof(d.fraisSuiviXof + d.fraisExpressXof)}.</p>
          <Link className="btn btn-primary" to={`/famille/demandes/${d.id}/paiement`}>
            Payer maintenant
          </Link>
        </WidgetCard>
      )}

      <WidgetCard title="Avancement" description="Étapes de traitement de votre dossier.">
        <StatutTimeline statut={d.statut} />
      </WidgetCard>

      <WidgetCard title="Informations du dossier">
        <dl className="dl">
          <dt>Élève</dt><dd>{d.elevePrenom} {d.eleveNom}</dd>
          <dt>Établissement</dt><dd>{d.etablissement.nom}</dd>
          <dt>Date limite</dt>
          <dd>
            {d.echeanceExterieure
              ? `${formatDate(d.echeanceExterieure)}${d.motifEcheance ? ` · ${d.motifEcheance}` : ''}`
              : 'Aucune'}
          </dd>
          <dt>Délai annoncé</dt>
          <dd>{d.delaiAnnonceJours != null ? `${d.delaiAnnonceJours} jours` : 'Pas encore communiqué'}</dd>
        </dl>
      </WidgetCard>

      {d.documents.length > 0 && (
        <WidgetCard title="Document scanné" description="Lien temporaire sécurisé.">
          <ScanViewer demandeId={d.id} />
        </WidgetCard>
      )}

      {d.coutEnvoiXof && (
        <WidgetCard title="Envoi de l'original">
          <p>Coût d&apos;envoi : {formatXof(d.coutEnvoiXof)} · {d.adresseEnvoi}</p>
          {envoiAPayer ? (
            <Link className="btn btn-primary" to={`/famille/demandes/${d.id}/paiement?type=ENVOI`}>
              Payer l&apos;envoi
            </Link>
          ) : (
            <p className="hint">Envoi réglé.</p>
          )}
        </WidgetCard>
      )}

      <WidgetCard
        title="Historique"
        description="Notifications et événements visibles pour votre famille."
        actions={<Button variant="secondary" onClick={() => reload(true)}>Actualiser</Button>}
      >
        <JournalList journal={d.journal} vueFamille />
      </WidgetCard>
    </div>
  )
}
