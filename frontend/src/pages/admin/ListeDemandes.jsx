import { Link, useSearchParams } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import StatutBadge from '@/components/ui/StatutBadge'
import { useFetch } from '@/hooks/useFetch'
import { listerDemandesAdmin } from '@/features/admin/admin.api'
import { STATUTS, TYPES_DOCUMENT } from '@/utils/constants'
import { formatDate } from '@/utils/format'

export default function ListeDemandes() {
  const [params, setParams] = useSearchParams()
  const statut = params.get('statut') ?? ''
  const { data, loading, error } = useFetch(
    () => listerDemandesAdmin(statut ? { statut } : undefined),
    [statut],
  )

  return (
    <section>
      <h1>Demandes</h1>
      <div className="toolbar">
        <label htmlFor="filtre-statut">État</label>
        <select
          id="filtre-statut"
          className="input"
          value={statut}
          onChange={(e) => setParams(e.target.value ? { statut: e.target.value } : {})}
        >
          <option value="">Tous</option>
          {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading && <Loader />}
      <Notice>{error}</Notice>
      {data && data.length === 0 && <p className="hint">Aucune demande.</p>}
      {data && data.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Référence</th><th>Document</th><th>Élève</th><th>Établissement</th>
                <th>État</th><th>Date limite</th><th>Créée le</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
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
    </section>
  )
}
