import { LANDING_STEPS } from '@/components/landing/landing-content'

export default function LandingSteps() {
  return (
    <section className="landing-section" aria-labelledby="landing-steps">
      <header className="landing-section__header">
        <p className="landing-section__kicker">Parcours</p>
        <h2 id="landing-steps" className="landing-section__title">
          Comment ça marche
        </h2>
        <p className="landing-section__desc">
          Quatre étapes claires, de la création du compte à la réception de votre document.
        </p>
      </header>
      <ol className="landing-steps">
        {LANDING_STEPS.map((etape) => (
          <li key={etape.num} className="landing-step">
            <span className="landing-step__num" aria-hidden="true">
              {etape.num}
            </span>
            <div>
              <h3 className="landing-step__title">{etape.title}</h3>
              <p className="landing-step__text">{etape.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
