import { useEffect } from 'react'

/** Parallax + oscillation (couche shift séparée du CSS bob). */
export default function LandingMotion() {
  useEffect(() => {
    let frame = 0

    function tick() {
      frame = requestAnimationFrame(tick)
      const t = performance.now() / 1000
      const scrollY = window.scrollY
      const layers = document.querySelectorAll('[data-landing-parallax]')

      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i]
        const shift = layer.querySelector('.landing-parallax__shift')
        if (!shift) continue

        const speed = Number(layer.dataset.landingParallax) || 0.06
        const phase = Number(layer.dataset.landingPhase) || i * 0.65
        const bob = Math.sin(t * 1.15 + phase) * 18
        const drift = Math.cos(t * 0.85 + phase) * 14
        const y = scrollY * speed + bob
        shift.style.transform = `translate3d(${drift.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      }
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      document.querySelectorAll('.landing-parallax__shift').forEach((el) => {
        el.style.transform = ''
      })
    }
  }, [])

  return null
}

export function ParallaxWrap({ speed = 0.06, phase = 0, anim = 'a', className = '', children }) {
  return (
    <div
      className={`landing-parallax ${className}`.trim()}
      data-landing-parallax={speed}
      data-landing-phase={phase}
    >
      <div className="landing-parallax__shift">
        <div className={`landing-parallax__bob landing-parallax__bob--${anim}`}>{children}</div>
      </div>
    </div>
  )
}
