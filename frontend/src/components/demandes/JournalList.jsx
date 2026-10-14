import { STATUTS } from '@/utils/constants'
import { formatDateHeure } from '@/utils/format'

const TYPES = {
  DEMANDE_CREEE: 'Demande créée',
  CHANGEMENT_STATUT: 'Changement d\'état',
  DEPLACEMENT: 'Déplacement',
  SCAN_AJOUTE: 'Scan ajouté',
  ENVOI_DEFINI: 'Envoi défini',
  RESULTAT_ENREGISTRE: 'Résultat enregistré',
  PAIEMENT_CONFIRME: 'Paiement confirmé',
  PAIEMENT_REFUSE: 'Paiement refusé',
  PAIEMENT_ECHOUE: 'Paiement échoué',
  RAPPEL_ECHEANCE: 'Rappel de date limite',
}

// Événements montrés à la famille (les autres sont des notes internes)
const TYPES_FAMILLE = ['DEMANDE_CREEE', 'CHANGEMENT_STATUT', 'SCAN_AJOUTE', 'PAIEMENT_CONFIRME', 'ENVOI_DEFINI']

export default function JournalList({ journal = [], vueFamille = false }) {
  const lignes = vueFamille ? journal.filter((e) => TYPES_FAMILLE.includes(e.type)) : journal
  if (lignes.length === 0) return <p className="hint">Aucun événement pour le moment.</p>

  return (
    <ul className="journal">
      {[...lignes].reverse().map((e) => (
        <li key={e.id}>
          <time>{formatDateHeure(e.createdAt)}</time>
          <div>
            <strong>
              {e.statutApres && e.type === 'CHANGEMENT_STATUT'
                ? STATUTS[e.statutApres]?.label
                : TYPES[e.type] ?? e.type}
            </strong>
            {e.message && <p>{e.message}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
