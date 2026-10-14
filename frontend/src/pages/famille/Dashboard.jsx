import { Link } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import DemandeCard from '@/components/demandes/DemandeCard'
import { useFetch } from '@/hooks/useFetch'
import { mesDemandes } from '@/features/demandes/demandes.api'

export default function Dashboard() {
  const { data, loading, error } = useFetch(mesDemandes)

  return (
    <section>
      <div className="card-row">
        <h1>Mes demandes</h1>
        <Link className="btn btn-primary" to="/famille/nouvelle">Nouvelle demande</Link>
      </div>
      {loading && <Loader />}
      <Notice>{error}</Notice>
      {data && data.length === 0 && (
        <div className="card">
          <p>Vous n'avez aucune demande.</p>
          <p className="hint">Faites votre première demande : un CEPD, un BEPC ou un relevé de notes.</p>
        </div>
      )}
      {data && data.map((d) => (
        <DemandeCard key={d.id} demande={d} to={`/famille/demandes/${d.id}`} />
      ))}
    </section>
  )
}
