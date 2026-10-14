import WidgetCard from '@/components/ui/WidgetCard'
import { FRAIS_SUIVI_XOF } from '@/utils/constants'
import { formatXof } from '@/utils/format'

export default function Tarifs() {
  return (
    <section className="tarifs-page">
      <header className="page-header page-header--compact">
        <h1 className="page-header__title">Tarifs</h1>
        <p className="page-header__desc">Transparence sur les frais de suivi et d&apos;envoi.</p>
      </header>
      <div className="tarifs-grid">
        <WidgetCard title="Suivi d'un document">
          <p className="tarif-price">{formatXof(FRAIS_SUIVI_XOF)}</p>
          <p>Par document, payés au dépôt de la demande.</p>
          <p className="hint">Dépôt, suivi auprès de l&apos;établissement, scan et avis à chaque étape.</p>
        </WidgetCard>
        <WidgetCard title="Envoi de l'original">
          <p>Facturé en plus, au coût réel de l&apos;envoi.</p>
        </WidgetCard>
        <WidgetCard title="Documents de plus de deux ans">
          <p>Même prix. Le délai de traitement est majoré de 50 %.</p>
        </WidgetCard>
        <WidgetCard title="Formule express">
          <p>Délai réduit contre un prix majoré. Tarif communiqué prochainement.</p>
        </WidgetCard>
      </div>
    </section>
  )
}
