import { PARCOURS, STATUTS } from '@/utils/constants'

/** Frise : où en est la demande. */
export default function StatutTimeline({ statut }) {
  if (statut === 'ANNULEE') {
    return <p className="notice notice-muted">Cette demande a été annulée.</p>
  }
  // Pièce manquante : on garde l'étape précédente et on signale le blocage
  const bloque = statut === 'PIECE_MANQUANTE'
  const index = bloque ? PARCOURS.indexOf('DEPOSEE_ETABLISSEMENT') : PARCOURS.indexOf(statut)

  return (
    <>
      <ol className="timeline" aria-label="Avancement de la demande">
        {PARCOURS.map((s, i) => {
          const etat = i < index ? 'fait' : i === index ? (bloque ? 'bloque' : 'courant') : 'a-venir'
          return (
            <li key={s} className={`timeline-step ${etat}`} aria-current={etat === 'courant' ? 'step' : undefined}>
              <span className="timeline-dot" aria-hidden="true" />
              <span>{STATUTS[s].label}</span>
            </li>
          )
        })}
      </ol>
      {bloque && (
        <p className="notice notice-error" role="alert">
          Une pièce manque pour traiter cette demande.
        </p>
      )}
    </>
  )
}
