import { Link } from 'react-router-dom'

export default function LandingCta() {
  return (
    <section className="landing-cta" aria-labelledby="landing-cta-title">
      <div className="landing-cta__inner">
        <p className="landing-cta__kicker">Prêt à avancer ?</p>
        <h2 id="landing-cta-title">Lancez votre première demande</h2>
        <p>
          Créez votre compte famille en quelques minutes. Vous pourrez déposer une demande,
          payer et suivre chaque dossier depuis un seul espace.
        </p>
        <div className="landing-cta__actions">
          <Link className="btn btn-lg landing-cta__btn" to="/inscription">
            Créer mon compte
          </Link>
          <Link className="landing-cta__link" to="/connexion">
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    </section>
  )
}
