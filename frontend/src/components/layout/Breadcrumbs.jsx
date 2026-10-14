import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  if (!items?.length) return null
  return (
    <nav className="breadcrumbs animate-in" aria-label="Fil d'Ariane">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`} className="breadcrumb-segment">
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className={isLast ? 'breadcrumb-current' : undefined}>{item.label}</span>
            )}
            {!isLast && <span className="breadcrumb-sep">&gt;</span>}
          </span>
        )
      })}
    </nav>
  )
}
