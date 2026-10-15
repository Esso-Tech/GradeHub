import { Link } from 'react-router-dom'
import { LANDING_FAQ } from '@/components/landing/landing-content'

export default function LandingFaq() {
  return (
    <section className="landing-section landing-section--faq" aria-labelledby="landing-faq">
      <div className="landing-faq__layout">
        <header className="landing-section__header">
          <p className="landing-section__kicker">Questions fréquentes</p>
          <h2 id="landing-faq" className="landing-section__title">
            Vous hésitez encore ?
          </h2>
          <p className="landing-section__desc">
            Les réponses essentielles avant de créer votre compte. Détail des prix sur la page{' '}
            <Link to="/tarifs">Tarifs</Link>.
          </p>
        </header>
        <div className="landing-faq__list">
          {LANDING_FAQ.map((item) => (
            <details key={item.q} className="landing-faq__item surface">
              <summary className="landing-faq__question">{item.q}</summary>
              <p className="landing-faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
