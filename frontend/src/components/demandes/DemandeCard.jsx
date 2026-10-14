import { Link } from 'react-router-dom'
import StatutBadge from '@/components/ui/StatutBadge'
import { TYPES_DOCUMENT } from '@/utils/constants'
import { formatDate } from '@/utils/format'

export default function DemandeCard({ demande, to }) {
  return (
    <Link to={to} className="card card-link">
      <div className="card-row">
        <strong>{TYPES_DOCUMENT[demande.typeDocument]}</strong>
        <StatutBadge statut={demande.statut} />
      </div>
      <p>{demande.elevePrenom} {demande.eleveNom} · {demande.etablissement?.nom}</p>
      <p className="hint">
        {demande.reference} · créée le {formatDate(demande.createdAt)}
        {demande.echeanceExterieure && ` · date limite ${formatDate(demande.echeanceExterieure)}`}
      </p>
    </Link>
  )
}
