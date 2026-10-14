import { describe, expect, it } from 'vitest'
import { transitionAutorisee } from '../src/services/etats'

describe("machine d'états", () => {
  it('suit le parcours nominal', () => {
    const parcours = [
      'EN_ATTENTE_PAIEMENT', 'PAYEE', 'DEPOSEE_ETABLISSEMENT', 'EN_COURS',
      'SIGNEE', 'SCAN_ENVOYE', 'ORIGINAL_ENVOYE', 'CLOTUREE',
    ] as const
    for (let i = 0; i < parcours.length - 1; i++) {
      expect(transitionAutorisee(parcours[i], parcours[i + 1])).toBe(true)
    }
  })

  it('interdit de sauter le paiement', () => {
    expect(transitionAutorisee('EN_ATTENTE_PAIEMENT', 'DEPOSEE_ETABLISSEMENT')).toBe(false)
  })

  it('ne rouvre pas une demande clôturée ou annulée', () => {
    expect(transitionAutorisee('CLOTUREE', 'EN_COURS')).toBe(false)
    expect(transitionAutorisee('ANNULEE', 'PAYEE')).toBe(false)
  })

  it('permet de signaler une pièce manquante puis de reprendre', () => {
    expect(transitionAutorisee('EN_COURS', 'PIECE_MANQUANTE')).toBe(true)
    expect(transitionAutorisee('PIECE_MANQUANTE', 'EN_COURS')).toBe(true)
  })
})
