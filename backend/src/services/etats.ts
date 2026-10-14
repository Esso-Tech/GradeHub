import type { StatutDemande } from '@prisma/client'

/** Machine d'états d'une demande. Fonctions pures. */
export const TRANSITIONS: Record<StatutDemande, StatutDemande[]> = {
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

export const STATUTS_TERMINAUX: StatutDemande[] = ['CLOTUREE', 'ANNULEE']

export function transitionAutorisee(de: StatutDemande, vers: StatutDemande) {
  return TRANSITIONS[de].includes(vers)
}

/** Message affiché à la famille à chaque changement d'état. */
export const MESSAGES_FAMILLE: Partial<Record<StatutDemande, string>> = {
  PAYEE: "Paiement reçu. Nous déposons votre demande auprès de l'établissement.",
  DEPOSEE_ETABLISSEMENT: "Votre demande a été déposée auprès de l'établissement.",
  PIECE_MANQUANTE: 'Une pièce manque pour traiter votre demande. Nous vous contactons.',
  EN_COURS: "Votre demande est en cours de traitement par l'établissement.",
  SIGNEE: 'Votre document est signé. Le scan arrive.',
  SCAN_ENVOYE: 'Le scan de votre document est disponible dans votre espace.',
  ORIGINAL_ENVOYE: "L'original de votre document est en cours d'envoi.",
  CLOTUREE: 'Votre demande est clôturée.',
  ANNULEE: 'Votre demande a été annulée.',
}
