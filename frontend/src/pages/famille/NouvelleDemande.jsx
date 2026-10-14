import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import DemandeForm from '@/components/demandes/DemandeForm'
import { useFetch } from '@/hooks/useFetch'
import { listerEtablissements } from '@/features/etablissements/etablissements.api'

export default function NouvelleDemande() {
  const { data, loading, error } = useFetch(listerEtablissements)

  return (
    <section className="narrow">
      <h1>Nouvelle demande</h1>
      {loading && <Loader />}
      <Notice>{error}</Notice>
      {data && data.length === 0 && (
        <Notice tone="info">Aucun établissement n'est encore partenaire. Revenez bientôt.</Notice>
      )}
      {data && data.length > 0 && <DemandeForm etablissements={data} />}
    </section>
  )
}
