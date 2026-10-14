import { Link, useSearchParams } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import StatutBadge from '@/components/ui/StatutBadge'
import PageHeader from '@/components/ui/PageHeader'
import WidgetCard from '@/components/ui/WidgetCard'
import { useFetch } from '@/hooks/useFetch'
import { listerDemandesAdmin } from '@/features/admin/admin.api'
import { STATUTS, TYPES_DOCUMENT } from '@/utils/constants'
import { formatDate } from '@/utils/format'

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

export default function ListeDemandes() {
  const [params, setParams] = useSearchParams()
  const statut = params.get('statut') ?? ''
  const recherche = params.get('recherche') ?? ''
  const { data, loading, error } = useFetch(
    () => listerDemandesAdmin(statut ? { statut } : undefined),
    [statut],
  )

  const liste = filtrer(data ?? [], recherche)

  return (
    <section>
      <PageHeader title="Demandes" description="Filtrer et ouvrir les dossiers en cours." />
      <WidgetCard title="Liste des dossiers">
        <div className="table-toolbar">
          <label className="sr-only" htmlFor="filtre-statut">État</label>
          <select
            id="filtre-statut"
            className="input input-search"
            value={statut}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              if (e.target.value) next.set('statut', e.target.value)
              else next.delete('statut')
              setParams(next)
            }}
          >
            <option value="">Tous les états</option>
            {Object.entries(STATUTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <input
            className="input input-search"
            placeholder="Rechercher…"
            value={recherche}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              const v = e.target.value.trim()
              if (v) next.set('recherche', v)
              else next.delete('recherche')
              setParams(next)
            }}
          />
        </div>

        {loading && <Loader />}
        <Notice>{error}</Notice>
        {data && liste.length === 0 && <p className="hint">Aucune demande ne correspond.</p>}
        {liste.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Document</th>
                  <th>Élève</th>
                  <th>Établissement</th>
                  <th>État</th>
                  <th>Date limite</th>
                  <th>Créée le</th>
                </tr>
              </thead>
              <tbody>
                {liste.map((d) => (
                  <tr key={d.id}>
                    <td><Link to={`/admin/demandes/${d.id}`}>{d.reference}</Link></td>
                    <td>{TYPES_DOCUMENT[d.typeDocument]}{d.ancien ? ' (ancien)' : ''}</td>
                    <td>{d.elevePrenom} {d.eleveNom}</td>
                    <td>{d.etablissement.nom}</td>
                    <td><StatutBadge statut={d.statut} /></td>
                    <td>{formatDate(d.echeanceExterieure)}</td>
                    <td>{formatDate(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </WidgetCard>
    </section>
  )
}
