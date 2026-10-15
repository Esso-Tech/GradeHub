import { ParallaxWrap } from '@/components/landing/LandingMotion'

function FloatShell({ speed, phase, anim, className, children }) {
  return (
    <ParallaxWrap speed={speed} phase={phase} anim={anim} className={className}>
      {children}
    </ParallaxWrap>
  )
}

/** Éléments décoratifs flottants (style carte blanche + formes), aria-hidden. */
export default function LandingFloatDecor({ variant = 'hero' }) {
  if (variant === 'scene') {
    return (
      <div className="landing-floats landing-floats--scene" aria-hidden="true">
        <FloatShell speed={0.04} phase={0.2} anim="a" className="landing-parallax--dot landing-parallax--tl">
          <span className="landing-shape landing-shape--dot landing-shape--gold" />
        </FloatShell>
        <FloatShell speed={0.07} phase={1.1} anim="b" className="landing-parallax--dot landing-parallax--tr">
          <span className="landing-shape landing-shape--dot landing-shape--teal" />
        </FloatShell>
        <FloatShell speed={0.05} phase={0.5} anim="c" className="landing-parallax--chevron">
          <span className="landing-shape landing-shape--chevron" />
        </FloatShell>

        <FloatShell speed={0.06} phase={0.8} anim="d" className="landing-parallax--card-profile">
          <div className="landing-float-card landing-float-card--profile">
            <span className="landing-float-card__avatar landing-float-card__avatar--navy">FK</span>
            <div>
              <p className="landing-float-card__name">Famille K.</p>
              <p className="landing-float-card__meta">2 demandes actives</p>
            </div>
          </div>
        </FloatShell>

        <FloatShell speed={0.08} phase={1.4} anim="e" className="landing-parallax--card-stat">
          <div className="landing-float-card landing-float-card--stat">
            <span className="landing-float-card__avatar landing-float-card__avatar--gold">MK</span>
            <div>
              <p className="landing-float-card__name">Marcus · BEPC</p>
              <p className="landing-float-card__stat">
                <strong>62 %</strong> du parcours
              </p>
            </div>
          </div>
        </FloatShell>

        <FloatShell speed={0.03} phase={0.1} anim="f" className="landing-parallax--orb">
          <span className="landing-shape landing-shape--orb landing-shape--orb-navy">
            <span className="landing-shape__orb-inner">GH</span>
          </span>
        </FloatShell>
        <FloatShell speed={0.09} phase={1.8} anim="g" className="landing-parallax--quarter-gold">
          <span className="landing-shape landing-shape--quarter landing-shape--quarter-gold" />
        </FloatShell>
        <FloatShell speed={0.05} phase={2.2} anim="h" className="landing-parallax--quarter-blue">
          <span className="landing-shape landing-shape--quarter landing-shape--quarter-blue" />
        </FloatShell>
        <FloatShell speed={0.07} phase={0.6} anim="i" className="landing-parallax--semicircle">
          <span className="landing-shape landing-shape--semicircle" />
        </FloatShell>
      </div>
    )
  }

  return (
    <div className="landing-floats landing-floats--hero" aria-hidden="true">
      <FloatShell speed={0.05} phase={0.3} anim="a" className="landing-parallax--dot landing-parallax--tl">
        <span className="landing-shape landing-shape--dot landing-shape--teal" />
      </FloatShell>
      <FloatShell speed={0.08} phase={1.2} anim="b" className="landing-parallax--dot landing-parallax--tr">
        <span className="landing-shape landing-shape--dot landing-shape--gold" />
      </FloatShell>

      <FloatShell speed={0.06} phase={0.7} anim="c" className="landing-parallax--card-compact">
        <div className="landing-float-card landing-float-card--compact">
          <span className="landing-float-card__avatar landing-float-card__avatar--navy">Vous</span>
          <div>
            <p className="landing-float-card__name">Paiement confirmé</p>
            <p className="landing-float-card__meta">1 500 XOF · suivi</p>
          </div>
        </div>
      </FloatShell>

      <FloatShell speed={0.07} phase={1.5} anim="d" className="landing-parallax--card-pill">
        <div className="landing-float-card landing-float-card--pill">
          <span className="landing-float-card__dot landing-float-card__dot--ok" />
          Scan disponible
        </div>
      </FloatShell>

      <FloatShell speed={0.04} phase={0.4} anim="e" className="landing-parallax--quarter-gold">
        <span className="landing-shape landing-shape--quarter landing-shape--quarter-gold" />
      </FloatShell>
      <FloatShell speed={0.06} phase={1} anim="f" className="landing-parallax--semicircle">
        <span className="landing-shape landing-shape--semicircle" />
      </FloatShell>
    </div>
  )
}
