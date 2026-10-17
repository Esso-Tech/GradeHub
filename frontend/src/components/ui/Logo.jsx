/** Logo GRADE HUB : toque de diplômé (pompon orange) + nom. */
const TONES = {
  brand: { bg: '#2f6f1f', cap: '#ffffff', base: '#dcefd5', tassel: '#f28c28' },
  light: { bg: '#ffffff', cap: '#2f6f1f', base: '#bfe0b4', tassel: '#f28c28' },
}

export function LogoMark({ size = 40, tone = 'brand', decorative = true, ...props }) {
  const c = TONES[tone] ?? TONES.brand
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'GRADE HUB'}
      aria-hidden={decorative ? 'true' : undefined}
      {...props}
    >
      <rect width="40" height="40" rx="10" fill={c.bg} />
      <path d="M20 9L35 16L20 23L5 16Z" fill={c.cap} />
      <path d="M11 20.5V27C11 29 15 31 20 31C25 31 29 29 29 27V20.5L20 25Z" fill={c.base} />
      <path d="M33 17.5V27" stroke={c.tassel} strokeWidth="2" strokeLinecap="round" />
      <circle cx="33" cy="29" r="2" fill={c.tassel} />
    </svg>
  )
}

export default function Logo({ tone = 'brand', size = 40, className = '' }) {
  return (
    <span className={`logo ${tone === 'light' ? 'logo--light' : ''} ${className}`}>
      <LogoMark size={size} tone={tone} />
      <span className="logo__word">
        GRADE <span>HUB</span>
      </span>
    </span>
  )
}
