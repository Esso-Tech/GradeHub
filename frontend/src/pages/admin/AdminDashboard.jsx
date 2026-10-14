import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import { useFetch } from '@/hooks/useFetch'
import { listerDemandesAdmin, lireStats } from '@/features/admin/admin.api'
import { STATUTS, TYPES_DOCUMENT, VERDICTS } from '@/utils/constants'
import { formatDate } from '@/utils/format'

const A_TRAITER = [
  { statut: 'PAYEE', label: 'À déposer à l\'établissement' },
  { statut: 'PIECE_MANQUANTE', label: 'Pièce manquante' },
  { statut: 'SIGNEE', label: 'Signées, scan à déposer' },
  { statut: 'SCAN_ENVOYE', label: 'Scan envoyé, original à remettre' },
  { statut: 'EN_ATTENTE_PAIEMENT', label: 'En attente de paiement' },
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

  return (
    <section>
      <h1>Tableau de bord</h1>

      <h2>À traiter</h2>
      <div className="grid">
        {A_TRAITER.map(({ statut, label }) => (
          <Link key={statut} className="card card-link stat" to={`/admin/demandes?statut=${statut}`}>
            <span className="stat-n">{par(statut).length}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <h2>Dates limites proches</h2>
      {urgentes.length === 0 ? (
        <p className="hint">Aucune demande en cours avec une date limite dans les 3 jours.</p>
      ) : (
        <ul className="list">
          {urgentes.map((d) => (
            <li key={d.id}>
              <Link to={`/admin/demandes/${d.id}`}>
                {d.reference} · {TYPES_DOCUMENT[d.typeDocument]} · {d.elevePrenom} {d.eleveNom}
              </Link>
              <Badge tone="alert">{formatDate(d.echeanceExterieure)}</Badge>
              <span className="hint">{STATUTS[d.statut].label}</span>
            </li>
          ))}
        </ul>
      )}

      <h2>Seuils du test</h2>
      {stats.loading && <Loader />}
      {stats.error && <Notice>{stats.error}</Notice>}
      {stats.data && (
        <div className="grid">
          {Object.entries(stats.data.seuils).map(([cle, s]) => {
            const v = VERDICTS[s.verdict]
            return (
              <Link key={cle} to="/admin/statistiques" className="card card-link stat">
                <span className="stat-n">{s.nombre} / {s.total}</span>
                <span>{NOMS_SEUILS[cle]}</span>
                <Badge tone={v.tone}>{v.label}</Badge>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
