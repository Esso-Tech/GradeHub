import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DemandeCard from '@/components/demandes/DemandeCard'
import Loader from '@/components/ui/Loader'
import MetricCard from '@/components/ui/MetricCard'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import { useFetch } from '@/hooks/useFetch'
import { mesDemandes } from '@/features/demandes/demandes.api'
import { STATUTS } from '@/utils/constants'
import { formatDate } from '@/utils/format'

const JOURS_7 = 7 * 24 * 60 * 60 * 1000

function filtrer(liste, term) {
  if (!term) return liste
  const q = term.toLowerCase()
  return liste.filter(
    (d) =>
      d.reference?.toLowerCase().includes(q) ||
      d.eleveNom?.toLowerCase().includes(q) ||
      d.elevePrenom?.toLowerCase().includes(q) ||
      d.etablissement?.nom?.toLowerCase().includes(q),
  )
}

export default function Dashboard() {
  const { data, loading, error } = useFetch(mesDemandes)
  const location = useLocation()
  const recherche = location.state?.recherche ?? ''

  const liste = useMemo(() => filtrer(data ?? [], recherche), [data, recherche])

  const stats = useMemo(() => {
    if (!data) return null
    return {
      paiement: data.filter((d) => d.statut === 'EN_ATTENTE_PAIEMENT').length,
      echeances: data.filter(
        (d) =>
          d.echeanceExterieure &&
          new Date(d.echeanceExterieure).getTime() - Date.now() < JOURS_7 &&
          !['CLOTUREE', 'ANNULEE'].includes(d.statut),
      ).length,
      scans: data.filter((d) => d.statut === 'SCAN_ENVOYE').length,
      cloturees: data.filter((d) => d.statut === 'CLOTUREE').length,
    }
  }, [data])

  const activite = useMemo(() => {
    if (!data) return []
    return [...data]
      .sort((a, b) => new Date(b.updatedAt ?? b.createdAt) - new Date(a.updatedAt ?? a.createdAt))
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        date: formatDate(d.updatedAt ?? d.createdAt),
        titre: `${d.elevePrenom} ${d.eleveNom}`,
        statut: STATUTS[d.statut]?.label,
        ref: d.reference,
      }))
  }, [data])

  return (
    <div className="dashboard-layout">
      <PageHeader
        title="Mes demandes"
        description="Suivez vos dossiers CEPD, BEPC et relevés de notes."
        actions={
          <Link className="btn btn-primary" to="/famille/nouvelle">
            Nouvelle demande
          </Link>
        }
      />

      {recherche && (
        <p className="hint filter-hint">
          Résultats pour « {recherche} » · <Link to="/famille" state={{}}>Effacer</Link>
        </p>
      )}

      {stats && (
        <div className="metric-grid">
          <MetricCard icon="payment" tone="red" value={stats.paiement} label="Paiements en attente" />
          <MetricCard icon="calendar" tone="green" value={stats.echeances} label="Échéances proches" />
          <MetricCard icon="document" tone="blue" value={stats.scans} label="Scans disponibles" />
          <MetricCard icon="folder" tone="cyan" value={stats.cloturees} label="Dossiers clôturés" />
        </div>
      )}

      <div className="dashboard-split">
        <div className="dashboard-split__main">
          {loading && <Loader />}
          <Notice>{error}</Notice>

          {data && liste.length === 0 && (
            <WidgetCard
              title="Aucune demande"
              description="Commencez par créer un dossier pour un élève."
            >
              <Link className="btn btn-primary" to="/famille/nouvelle">
                Créer ma première demande
              </Link>
            </WidgetCard>
          )}

          {liste.length > 0 && (
            <div className="demande-list">
              {liste.map((d, i) => (
                <DemandeCard key={d.id} demande={d} index={i} to={`/famille/demandes/${d.id}`} />
              ))}
            </div>
          )}
        </div>

        <aside className="dashboard-split__aside">
          <WidgetCard title="Activité récente" description="Dernières mises à jour de vos dossiers.">
            {activite.length === 0 ? (
              <p className="hint">Les événements s&apos;afficheront ici au fil du suivi.</p>
            ) : (
              <ul className="activity-feed">
                {activite.map((a) => (
                  <li key={a.id} className="activity-feed__item">
                    <time className="activity-feed__time">{a.date}</time>
                    <div className="activity-feed__body">
                      <strong>{a.titre}</strong>
                      <span>{a.statut}</span>
                      <small>{a.ref}</small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </WidgetCard>

          <WidgetCard title="Informations utiles">
            <ul className="link-list">
              <li><Link to="/tarifs">Tarifs et formules</Link></li>
              <li><Link to="/famille/nouvelle">Déposer une nouvelle demande</Link></li>
            </ul>
          </WidgetCard>
        </aside>
      </div>
    </div>
  )
}
