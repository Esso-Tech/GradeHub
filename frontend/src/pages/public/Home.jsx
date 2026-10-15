import { Link, Navigate } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import MetricCard from '@/components/ui/MetricCard'
import { IconCap, IconChevronRight } from '@/components/ui/Icons'
import { useAuth } from '@/hooks/useAuth'

const ETAPES = [
  {
    num: '1',
    title: 'Déposez votre demande',
    text: 'Établissement, type de document et coordonnées : le formulaire guide chaque étape.',
  },
  {
    num: '2',
    title: 'Payez les frais de suivi',
    text: 'Règlement sécurisé par mobile money. Vous recevez une confirmation immédiate.',
  },
  {
    num: '3',
    title: 'Suivez l\'avancement',
    text: 'Statut en ligne et alertes SMS ou WhatsApp à chaque étape importante.',
  },
  {
    num: '4',
    title: 'Recevez votre document',
    text: 'Scan dès la signature à l\'établissement, puis remise de l\'original en main propre.',
  },
]

const AVANTAGES = [
  {
    title: 'Gain de temps',
    text: 'Plus besoin de vous déplacer plusieurs fois au secrétariat pour la même pièce.',
  },
  {
    title: 'Visibilité',
    text: 'Vous savez où en est votre dossier, sans appeler l\'école chaque semaine.',
  },
  {
    title: 'Sérénité',
    text: 'Relances et suivi pris en charge par une équipe dédiée à Lomé.',
  },
]

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }
  if (user?.role === 'FAMILLE') {
    return <Navigate to="/famille" replace />
  }

  return (
    <div className="landing">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__bg" aria-hidden="true" />
        <div className="landing-hero__grid">
          <div className="landing-hero__copy">
            <p className="landing-hero__kicker">Lomé · Documents scolaires</p>
            <h1 id="landing-title">
              Votre document scolaire,{' '}
              <span className="landing-hero__accent">sans courir après le secrétariat</span>
            </h1>
            <p className="landing-hero__lead">
              Confiez votre demande à GRADE HUB. Nous la suivons auprès de l&apos;établissement,
              vous savez où elle en est, vous recevez le scan dès la signature, puis l&apos;original.
            </p>
            <div className="landing-hero__actions">
              <Link className="btn btn-primary btn-lg landing-hero__cta-primary" to="/inscription">
                Faire une demande
                <IconChevronRight size={18} />
              </Link>
              <Link className="btn btn-secondary btn-lg landing-hero__cta-secondary" to="/tarifs">
                Voir les tarifs
              </Link>
            </div>
            <ul className="landing-hero__tags" aria-label="Types de documents">
              <li>CEPD</li>
              <li>BEPC</li>
              <li>Relevés Seconde à Terminale</li>
            </ul>
          </div>

          <aside className="landing-preview" aria-label="Exemple de suivi de demande">
            <div className="landing-preview__head">
              <IconCap size={22} className="landing-preview__cap" />
              <div>
                <p className="landing-preview__label">Suivi en direct</p>
                <p className="landing-preview__ref">Demande · GH-2026-0042</p>
              </div>
            </div>
            <ol className="landing-preview__timeline">
              <li className="landing-preview__step landing-preview__step--done">
                <span className="landing-preview__dot" />
                <span>Paiement confirmé</span>
              </li>
              <li className="landing-preview__step landing-preview__step--done">
                <span className="landing-preview__dot" />
                <span>Déposée à l&apos;établissement</span>
              </li>
              <li className="landing-preview__step landing-preview__step--active">
                <span className="landing-preview__dot" />
                <span>En cours de traitement</span>
              </li>
              <li className="landing-preview__step">
                <span className="landing-preview__dot" />
                <span>Scan puis original</span>
              </li>
            </ol>
            <p className="landing-preview__note">
              Illustration : votre tableau de bord affiche le même niveau de détail.
            </p>
          </aside>
        </div>
      </section>

      <div className="landing-body">
        <section className="landing-section" aria-labelledby="landing-highlights">
          <h2 id="landing-highlights" className="landing-section__title sr-only">
            Points clés du service
          </h2>
          <div className="metric-grid metric-grid--landing">
            <MetricCard icon="payment" tone="red" value="1 500" label="XOF · frais de suivi" to="/tarifs" />
            <MetricCard icon="phone" tone="green" value="SMS" label="WhatsApp · alertes" />
            <MetricCard icon="document" tone="blue" value="Scan" label="Dès signature" />
            <MetricCard icon="package" tone="cyan" value="Original" label="Remise en main propre" />
          </div>
        </section>

        <section className="landing-section" aria-labelledby="landing-steps">
          <header className="landing-section__header">
            <p className="landing-section__kicker">Parcours</p>
            <h2 id="landing-steps" className="landing-section__title">
              Comment ça marche
            </h2>
            <p className="landing-section__desc">
              Quatre étapes simples, de la demande en ligne à la réception de votre document.
            </p>
          </header>
          <ol className="landing-steps">
            {ETAPES.map((etape) => (
              <li key={etape.num} className="landing-step">
                <span className="landing-step__num">{etape.num}</span>
                <div>
                  <h3 className="landing-step__title">{etape.title}</h3>
                  <p className="landing-step__text">{etape.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-section landing-section--benefits" aria-labelledby="landing-why">
          <header className="landing-section__header">
            <p className="landing-section__kicker">Pour les familles</p>
            <h2 id="landing-why" className="landing-section__title">
              Pourquoi GRADE HUB
            </h2>
          </header>
          <ul className="landing-benefits">
            {AVANTAGES.map((item) => (
              <li key={item.title} className="landing-benefit surface">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing-cta" aria-labelledby="landing-cta-title">
          <div className="landing-cta__inner">
            <h2 id="landing-cta-title">Prêt à lancer votre demande ?</h2>
            <p>Créez votre compte famille en quelques minutes. Vous pourrez suivre chaque dossier depuis votre espace.</p>
            <div className="landing-cta__actions">
              <Link className="btn btn-lg landing-cta__btn" to="/inscription">
                Commencer maintenant
              </Link>
              <Link className="landing-cta__link" to="/connexion">
                J&apos;ai déjà un compte
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
