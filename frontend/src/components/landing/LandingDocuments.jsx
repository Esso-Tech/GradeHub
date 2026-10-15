import { Link } from 'react-router-dom'
import { MetricIcon } from '@/components/ui/Icons'
import { LANDING_DOCUMENTS } from '@/components/landing/landing-content'

export default function LandingDocuments() {
  return (
    <section className="landing-section landing-section--surface" aria-labelledby="landing-docs">
      <header className="landing-section__header landing-section__header--wide">
        <p className="landing-section__kicker">Documents</p>
        <h2 id="landing-docs" className="landing-section__title">
          Ce que nous prenons en charge
        </h2>
        <p className="landing-section__desc">
          Trois familles de pièces aujourd&apos;hui, avec un parcours identique : dépôt en ligne,
          suivi humain à Lomé, livraison numérique puis physique.
        </p>
      </header>
      <ul className="landing-docs">
        {LANDING_DOCUMENTS.map((doc) => (
          <li key={doc.title} className="landing-doc surface">
            <span className="landing-doc__icon">
              <MetricIcon name={doc.icon} size={24} />
            </span>
            <h3 className="landing-doc__title">{doc.title}</h3>
            <p className="landing-doc__text">{doc.text}</p>
          </li>
        ))}
      </ul>
      <p className="landing-section__foot">
        <Link to="/inscription" className="landing-section__link">
          Commencer une demande
        </Link>
        {' · '}
        <Link to="/tarifs" className="landing-section__link">
          Voir les tarifs
        </Link>
      </p>
    </section>
  )
}
