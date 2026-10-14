import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import MetricCard from '@/components/ui/MetricCard'
import Notice from '@/components/ui/Notice'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import { useFetch } from '@/hooks/useFetch'
import { listerDemandesAdmin, lireStats } from '@/features/admin/admin.api'
import { STATUTS, TYPES_DOCUMENT, VERDICTS } from '@/utils/constants'
import { formatDate } from '@/utils/format'

const A_TRAITER = [
  { statut: 'PAYEE', label: 'À déposer', tone: 'red', icon: 'clipboard' },
  { statut: 'PIECE_MANQUANTE', label: 'Pièce manquante', tone: 'green', icon: 'document' },
  { statut: 'SIGNEE', label: 'Scan à déposer', tone: 'blue', icon: 'folder' },
  { statut: 'SCAN_ENVOYE', label: 'Original à remettre', tone: 'cyan', icon: 'package' },
]
const JOURS_3 = 3 * 24 * 60 * 60 * 1000
const TERMINES = ['CLOTUREE', 'ANNULEE']

const NOMS_SEUILS = {
  disposition_a_payer: 'Disposition à payer',
  un_seul_deplacement: 'Un seul déplacement',
  document_obtenu: 'Document obtenu',
}

export default function AdminDashboard() {
  const demandes = useFetch(() => listerDemandesAdmin())
  const stats = useFetch(lireStats)

  if (demandes.loading) return <Loader />
  if (demandes.error) return <Notice>{demandes.error}</Notice>

  const liste = demandes.data
  const par = (s) => liste.filter((d) => d.statut === s)
  const urgentes = liste.filter(
    (d) =>
      !TERMINES.includes(d.statut) &&
      d.echeanceExterieure &&
      new Date(d.echeanceExterieure).getTime() - Date.now() < JOURS_3,
  )
  const enAttentePaiement = par('EN_ATTENTE_PAIEMENT').length
  const enCours = liste.filter((d) => !TERMINES.includes(d.statut)).length

  return (
    <div className="dashboard-layout">
      <PageHeader
        title="Vue générale"
        description="Priorités opérationnelles et suivi des dossiers."
        actions={<Link className="btn btn-secondary btn-sm" to="/admin/demandes">Toutes les demandes</Link>}
      />

      <div className="metric-grid">
        {A_TRAITER.map(({ statut, label, tone, icon }) => (
          <MetricCard
            key={statut}
            icon={icon}
            tone={tone}
            value={par(statut).length}
            label={label}
            to={`/admin/demandes?statut=${statut}`}
          />
        ))}
      </div>

      <div className="metric-grid metric-grid--compact">
        <MetricCard icon="payment" tone="red" value={enAttentePaiement} label="En attente de paiement" to="/admin/demandes?statut=EN_ATTENTE_PAIEMENT" />
        <MetricCard icon="clipboard" tone="green" value={enCours} label="Dossiers actifs" to="/admin/demandes" />
        <MetricCard icon="document" tone="blue" value={par('SCAN_ENVOYE').length} label="Scans envoyés" />
        <MetricCard icon="wallet" tone="cyan" value={liste.length} label="Total demandes" />
      </div>

      <div className="dashboard-split">
        <div className="dashboard-split__main">
          <WidgetCard title="Échéances proches" description="Dossiers avec date limite sous 3 jours.">
            {urgentes.length === 0 ? (
              <p className="hint">Aucune échéance urgente.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Document</th>
                      <th>Élève</th>
                      <th>Échéance</th>
                      <th>État</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urgentes.map((d) => (
                      <tr key={d.id}>
                        <td><Link to={`/admin/demandes/${d.id}`}>{d.reference}</Link></td>
                        <td>{TYPES_DOCUMENT[d.typeDocument]}</td>
                        <td>{d.elevePrenom} {d.eleveNom}</td>
                        <td><Badge tone="alert">{formatDate(d.echeanceExterieure)}</Badge></td>
                        <td>{STATUTS[d.statut].label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </WidgetCard>

          <WidgetCard
            title="Demandes récentes"
            description="Aperçu des derniers dossiers."
            actions={<Link className="btn btn-primary btn-sm" to="/admin/demandes">Liste complète</Link>}
          >
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Type</th>
                    <th>État</th>
                    <th>Créée le</th>
                  </tr>
                </thead>
                <tbody>
                  {liste.slice(0, 8).map((d) => (
                    <tr key={d.id}>
                      <td><Link to={`/admin/demandes/${d.id}`}>{d.reference}</Link></td>
                      <td>{TYPES_DOCUMENT[d.typeDocument]}</td>
                      <td>{STATUTS[d.statut].label}</td>
                      <td>{formatDate(d.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetCard>
        </div>

        <aside className="dashboard-split__aside">
          <WidgetCard title="Alertes" description="Dossiers à traiter en priorité.">
            <ul className="activity-feed">
              {urgentes.slice(0, 4).map((d) => (
                <li key={d.id} className="activity-feed__item">
                  <time className="activity-feed__time">{formatDate(d.echeanceExterieure)}</time>
                  <div className="activity-feed__body">
                    <strong>{d.elevePrenom} {d.eleveNom}</strong>
                    <span>{STATUTS[d.statut].label}</span>
                    <small>{d.reference}</small>
                  </div>
                </li>
              ))}
              {urgentes.length === 0 && <p className="hint">Aucune alerte pour le moment.</p>}
            </ul>
          </WidgetCard>

          {stats.loading && <Loader />}
          {stats.error && <Notice>{stats.error}</Notice>}
          {stats.data && (
            <WidgetCard title="Seuils du test MVP">
              <ul className="link-list link-list--stats">
                {Object.entries(stats.data.seuils).map(([cle, s]) => {
                  const v = VERDICTS[s.verdict]
                  return (
                    <li key={cle}>
                      <Link to="/admin/statistiques">
                        <span className="link-list__label">{NOMS_SEUILS[cle]}</span>
                        <span className="link-list__value">{s.nombre} / {s.total}</span>
                        <Badge tone={v.tone}>{v.label}</Badge>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </WidgetCard>
          )}
        </aside>
      </div>
    </div>
  )
}
