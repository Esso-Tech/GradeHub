import { Link } from 'react-router-dom'
import { IconChevronRight } from '@/components/ui/Icons'
import StatutBadge from '@/components/ui/StatutBadge'
import { TYPES_DOCUMENT } from '@/utils/constants'
import { formatDate } from '@/utils/format'

function avatarTone(nom) {
  const n = (nom ?? 'A').charCodeAt(0) % 4
  return ['a', 'b', 'c', 'd'][n]
}

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
}

export default function DemandeCard({ demande, to, index = 0 }) {
  const tone = avatarTone(demande.eleveNom)

  return (
    <Link
      to={to}
      className="demande-card"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className={`demande-card__avatar demande-card__avatar--${tone}`}>
        {initials(demande.elevePrenom, demande.eleveNom)}
      </span>
      <span className="demande-card__main">
        <span className="demande-card__top">
          <strong>{demande.elevePrenom} {demande.eleveNom}</strong>
          <StatutBadge statut={demande.statut} />
        </span>
        <span className="demande-card__doc">{TYPES_DOCUMENT[demande.typeDocument]}</span>
        <span className="demande-card__meta">
          {demande.reference}
          {demande.etablissement?.nom && ` · ${demande.etablissement.nom}`}
          {demande.echeanceExterieure && ` · limite ${formatDate(demande.echeanceExterieure)}`}
        </span>
      </span>
      <IconChevronRight className="demande-card__chevron" size={22} />
    </Link>
  )
}
