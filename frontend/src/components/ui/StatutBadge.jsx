import Badge from './Badge'
import { STATUTS } from '@/utils/constants'

export default function StatutBadge({ statut }) {
  const s = STATUTS[statut] ?? { label: statut, tone: 'muted' }
  return <Badge tone={s.tone}>{s.label}</Badge>
}
