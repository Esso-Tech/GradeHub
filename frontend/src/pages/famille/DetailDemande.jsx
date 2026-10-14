import { Link, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import StatutBadge from '@/components/ui/StatutBadge'
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
    <section>
      <p><Link to="/famille">← Mes demandes</Link></p>
      <h1>{TYPES_DOCUMENT[d.typeDocument]}</h1>
      <p>
        <StatutBadge statut={d.statut} />{' '}
        <span className="hint">{d.reference}</span>
      </p>

      {!suiviPaye && d.statut !== 'ANNULEE' && (
        <div className="card">
          <h3>Paiement en attente</h3>
          <p>Nous commençons le suivi dès réception de {formatXof(d.fraisSuiviXof + d.fraisExpressXof)}.</p>
          <Link className="btn btn-primary" to={`/famille/demandes/${d.id}/paiement`}>Payer maintenant</Link>
        </div>
      )}

      <StatutTimeline statut={d.statut} />

      <div className="card">
        <dl className="dl">
          <dt>Élève</dt><dd>{d.elevePrenom} {d.eleveNom}</dd>
          <dt>Établissement</dt><dd>{d.etablissement.nom}</dd>
          <dt>Date limite</dt>
          <dd>{d.echeanceExterieure ? `${formatDate(d.echeanceExterieure)}${d.motifEcheance ? ` · ${d.motifEcheance}` : ''}` : 'Aucune'}</dd>
          <dt>Délai annoncé</dt>
          <dd>{d.delaiAnnonceJours != null ? `${d.delaiAnnonceJours} jours` : 'Pas encore communiqué'}</dd>
        </dl>
      </div>

      {d.documents.length > 0 && (
        <div className="card">
          <h3>Votre document est disponible</h3>
          <p className="hint">Le lien du scan est valable quelques minutes. Rouvrez-le si besoin.</p>
          <ScanViewer demandeId={d.id} />
        </div>
      )}

      {d.coutEnvoiXof && (
        <div className="card">
          <h3>Envoi de l'original</h3>
          <p>Coût d'envoi : {formatXof(d.coutEnvoiXof)} · {d.adresseEnvoi}</p>
          {envoiAPayer ? (
            <Link className="btn btn-primary" to={`/famille/demandes/${d.id}/paiement?type=ENVOI`}>
              Payer l'envoi
            </Link>
          ) : (
            <p className="hint">Envoi réglé.</p>
          )}
        </div>
      )}

      <h2>Suivi</h2>
      <JournalList journal={d.journal} vueFamille />
      <p><Button variant="secondary" onClick={() => reload(true)}>Actualiser</Button></p>
    </section>
  )
}
