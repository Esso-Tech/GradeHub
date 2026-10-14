export const STATUTS = {
  EN_ATTENTE_PAIEMENT: { label: 'En attente de paiement', tone: 'warn' },
  PAYEE: { label: 'Payée', tone: 'info' },
  DEPOSEE_ETABLISSEMENT: { label: "Déposée à l'établissement", tone: 'info' },
  PIECE_MANQUANTE: { label: 'Pièce manquante', tone: 'alert' },
  EN_COURS: { label: 'En cours', tone: 'info' },
  SIGNEE: { label: 'Signée', tone: 'ok' },
  SCAN_ENVOYE: { label: 'Scan disponible', tone: 'ok' },
  ORIGINAL_ENVOYE: { label: 'Original envoyé', tone: 'ok' },
  CLOTUREE: { label: 'Clôturée', tone: 'done' },
  ANNULEE: { label: 'Annulée', tone: 'muted' },
}

// Parcours nominal, affiché dans la frise
export const PARCOURS = [
  'EN_ATTENTE_PAIEMENT', 'PAYEE', 'DEPOSEE_ETABLISSEMENT', 'EN_COURS',
  'SIGNEE', 'SCAN_ENVOYE', 'ORIGINAL_ENVOYE', 'CLOTUREE',
]

// Doit rester identique à backend/src/services/etats.ts
export const TRANSITIONS = {
  EN_ATTENTE_PAIEMENT: ['PAYEE', 'ANNULEE'],
  PAYEE: ['DEPOSEE_ETABLISSEMENT', 'ANNULEE'],
  DEPOSEE_ETABLISSEMENT: ['EN_COURS', 'PIECE_MANQUANTE', 'ANNULEE'],
  PIECE_MANQUANTE: ['DEPOSEE_ETABLISSEMENT', 'EN_COURS', 'ANNULEE'],
  EN_COURS: ['SIGNEE', 'PIECE_MANQUANTE', 'ANNULEE'],
  SIGNEE: ['SCAN_ENVOYE'],
  SCAN_ENVOYE: ['ORIGINAL_ENVOYE', 'CLOTUREE'],
  ORIGINAL_ENVOYE: ['CLOTUREE'],
  CLOTUREE: [],
  ANNULEE: [],
}

export const TYPES_DOCUMENT = {
  CEPD: 'CEPD',
  BEPC: 'BEPC',
  RELEVE_NOTES: 'Relevé de notes (Seconde à Terminale)',
}

export const OPERATEURS = { TMONEY: 'T-Money', FLOOZ: 'Flooz' }

export const VERDICTS = {
  VALIDE: { label: 'Validé', tone: 'ok' },
  INVALIDE: { label: 'Invalidé', tone: 'alert' },
  A_APPROFONDIR: { label: 'À approfondir', tone: 'warn' },
  ECHANTILLON_INSUFFISANT: { label: 'Échantillon insuffisant', tone: 'muted' },
}

export const FRAIS_SUIVI_XOF = 1500
