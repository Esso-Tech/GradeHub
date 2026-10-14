import { Link } from 'react-router-dom'
import { MetricIcon } from '@/components/ui/Icons'

export default function MetricCard({ icon, tone = 'blue', value, label, to }) {
  const body = (
    <>
      <span className={`metric-card__icon metric-card__icon--${tone}`}>
        <MetricIcon name={icon} size={22} />
      </span>
      <span className="metric-card__content">
        <span className="metric-card__value">{value}</span>
        <span className="metric-card__label">{label}</span>
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="metric-card metric-card--interactive">
        {body}
      </Link>
    )
  }
  return <article className="metric-card">{body}</article>
}
