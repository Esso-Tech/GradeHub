import { useEffect, useRef, useState } from 'react'

export default function LandingReveal({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => setVisible(true)
    const fallback = window.setTimeout(show, 700)

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.95) show()

    if (typeof IntersectionObserver === 'undefined') {
      show()
      return () => window.clearTimeout(fallback)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 5% 0px' },
    )
    observer.observe(el)

    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`landing-reveal ${visible ? 'landing-reveal--in' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
