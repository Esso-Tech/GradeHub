import { FRAIS_SUIVI_XOF } from '@/utils/constants'
import { formatXof } from '@/utils/format'

export default function Tarifs() {
  return (
    <section>
      <h1>Tarifs</h1>
      <div className="card">
        <h3>Suivi d'un document</h3>
        <p><strong>{formatXof(FRAIS_SUIVI_XOF)}</strong> par document, payés au dépôt de la demande.</p>
        <p className="hint">Dépôt, suivi auprès de l'établissement, scan et avis à chaque étape.</p>
      </div>
      <div className="card">
        <h3>Envoi de l'original</h3>
        <p>Facturé en plus, au coût réel de l'envoi.</p>
      </div>
      <div className="card">
        <h3>Documents de plus de deux ans</h3>
        <p>Même prix. Le délai de traitement est majoré de 50 %.</p>
      </div>
      <div className="card">
        <h3>Formule express</h3>
        <p>Délai réduit contre un prix majoré. Le prix sera communiqué prochainement.</p>
      </div>
    </section>
  )
}
