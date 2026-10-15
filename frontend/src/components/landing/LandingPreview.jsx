import { IconCap } from '@/components/ui/Icons'
import { LANDING_PREVIEW } from '@/components/landing/landing-content'

export default function LandingPreview() {
  const { ref, label, status, progress, steps } = LANDING_PREVIEW

  return (
    <aside className="landing-preview" aria-label="Exemple de suivi de demande">
      <div className="landing-preview__chrome">
        <span className="landing-preview__chrome-dot" />
        <span className="landing-preview__chrome-dot" />
        <span className="landing-preview__chrome-dot" />
      </div>
      <div className="landing-preview__head">
        <IconCap size={22} className="landing-preview__cap" />
        <div className="landing-preview__head-text">
          <p className="landing-preview__label">Suivi en direct</p>
          <p className="landing-preview__ref">{ref}</p>
          <p className="landing-preview__meta">{label}</p>
        </div>
        <span className="landing-preview__badge">{status}</span>
      </div>
      <div className="landing-preview__progress" role="presentation">
        <div className="landing-preview__progress-track">
          <div
            className="landing-preview__progress-fill landing-preview__progress-fill--live"
            style={{ '--progress': `${progress}%` }}
          />
        </div>
        <span className="landing-preview__progress-label">{progress} % du parcours</span>
      </div>
      <ol className="landing-preview__timeline">
        {steps.map((step) => (
          <li
            key={step.label}
            className={`landing-preview__step landing-preview__step--${step.state}`}
          >
            <span className="landing-preview__dot" />
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
      <p className="landing-preview__note">
        Aperçu illustratif : votre tableau de bord affiche le même niveau de détail.
      </p>
    </aside>
  )
}
