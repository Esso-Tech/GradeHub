import Loader from '@/components/ui/Loader'
import Notice from '@/components/ui/Notice'
import WidgetCard from '@/components/ui/WidgetCard'
import DemandeForm from '@/components/demandes/DemandeForm'
import { useFetch } from '@/hooks/useFetch'
import { listerEtablissements } from '@/features/etablissements/etablissements.api'

export default function NouvelleDemande() {
  const { data, loading, error } = useFetch(listerEtablissements)

  return (
    <section className="page">
      <header className="page-header page-header--compact">
        <h1 className="page-header__title">Nouvelle demande</h1>
      </header>
      {loading && <Loader />}
      <Notice>{error}</Notice>
      {data && data.length === 0 && (
        <Notice tone="info">Aucun établissement n&apos;est encore partenaire. Revenez bientôt.</Notice>
      )}
      {data && data.length > 0 && (
        <WidgetCard title="Dossier documentaire" description="Renseignez l'élève, le document et le mandat.">
          <DemandeForm etablissements={data} />
        </WidgetCard>
      )}
    </section>
  )
}
