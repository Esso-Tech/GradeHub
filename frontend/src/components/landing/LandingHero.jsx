import { Link } from 'react-router-dom'
import { IconChevronRight } from '@/components/ui/Icons'
import LandingFloatDecor from '@/components/landing/LandingFloatDecor'
import LandingPreview from '@/components/landing/LandingPreview'

export default function LandingHero() {
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero__bg" aria-hidden="true">
        <div className="landing-hero__glow landing-hero__glow--gold" />
        <div className="landing-hero__glow landing-hero__glow--blue" />
      </div>
      <div className="landing-hero__grid landing-hero__grid--enter">
        <div className="landing-hero__copy landing-hero__copy--stagger">
          <p className="landing-hero__kicker landing-hero__stagger-item">Conciergerie scolaire · Lomé</p>
          <h1 id="landing-title" className="landing-hero__stagger-item">
            Vos documents scolaires,
            <span className="landing-hero__accent"> suivis pour vous</span>
          </h1>
          <p className="landing-hero__lead landing-hero__stagger-item">
            GRADE HUB dépose et suit votre demande auprès de l&apos;établissement. Vous payez en
            ligne, vous suivez chaque étape, vous recevez le scan puis l&apos;original sans courir
            après le secrétariat.
          </p>
          <div className="landing-hero__actions landing-hero__stagger-item">
            <Link className="btn btn-primary btn-lg landing-hero__cta-primary" to="/inscription">
              Démarrer une demande
              <IconChevronRight size={18} />
            </Link>
            <Link className="btn btn-secondary btn-lg landing-hero__cta-secondary" to="/tarifs">
              Consulter les tarifs
            </Link>
          </div>
          <ul className="landing-hero__checks landing-hero__stagger-item" aria-label="Points forts">
            <li>Paiement mobile money sécurisé</li>
            <li>Alertes SMS et WhatsApp</li>
            <li>Espace famille en ligne</li>
          </ul>
        </div>
        <div className="landing-hero__visual">
          <LandingFloatDecor variant="hero" />
          <div className="landing-preview-wrap">
            <LandingPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
