import { LANDING_BENEFITS } from '@/components/landing/landing-content'

export default function LandingBenefits() {
  return (
    <section
      className="landing-section landing-section--benefits"
      aria-labelledby="landing-why"
    >
      <header className="landing-section__header">
        <p className="landing-section__kicker">Pour les familles</p>
        <h2 id="landing-why" className="landing-section__title">
          Pourquoi choisir GRADE HUB
        </h2>
        <p className="landing-section__desc">
          Un service pensé pour celles et ceux qui n&apos;ont pas le temps de relancer les écoles
          en boucle.
        </p>
      </header>
      <ul className="landing-benefits">
        {LANDING_BENEFITS.map((item) => (
          <li key={item.title} className="landing-benefit surface">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
