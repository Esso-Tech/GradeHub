import { LANDING_TRUST } from '@/components/landing/landing-content'

export default function LandingTrustBar() {
  return (
    <section className="landing-trust landing-trust--enter" aria-label="Engagements du service">
      <ul className="landing-trust__list">
        {LANDING_TRUST.map((item) => (
          <li key={item.label} className="landing-trust__item">
            <span className="landing-trust__value">{item.value}</span>
            <span className="landing-trust__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
