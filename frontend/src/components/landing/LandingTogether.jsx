import { Link } from 'react-router-dom'
import LandingFloatDecor from '@/components/landing/LandingFloatDecor'
import LandingReveal from '@/components/landing/LandingReveal'

export default function LandingTogether() {
  return (
    <LandingReveal>
      <section className="landing-scene" aria-labelledby="landing-together">
        <div className="landing-scene__stage">
          <LandingFloatDecor variant="scene" />
          <div className="landing-scene__card">
            <p className="landing-scene__kicker">Espace famille</p>
            <h2 id="landing-together" className="landing-scene__title">
              Un suivi clair, pour toute la famille
            </h2>
            <p className="landing-scene__text">
              Certaines démarches se gèrent{' '}
              <span className="landing-scene__highlight">mieux ensemble</span>. Déposez une demande,
              suivez les alertes SMS ou WhatsApp et retrouvez chaque dossier au même endroit, sans
              relancer le secrétariat en boucle.
            </p>
            <Link className="btn btn-primary landing-scene__cta" to="/inscription">
              Créer un compte famille
            </Link>
          </div>
        </div>
      </section>
    </LandingReveal>
  )
}
