import { describe, expect, it } from 'vitest'
import { SEUILS, verdict } from '../src/utils/seuils'

describe('seuils du test MVP', () => {
  it('refuse de conclure sur un échantillon trop petit', () => {
    expect(verdict(5, 6, SEUILS.paiement)).toBe('ECHANTILLON_INSUFFISANT')
  })

  it('valide à 5 paiements sur 15', () => {
    expect(verdict(5, 15, SEUILS.paiement)).toBe('VALIDE')
  })

  it('invalide sous 2 paiements sur 15', () => {
    expect(verdict(1, 15, SEUILS.paiement)).toBe('INVALIDE')
  })

  it('reste « à approfondir » entre les deux', () => {
    expect(verdict(3, 15, SEUILS.paiement)).toBe('A_APPROFONDIR')
  })

  it('un seul déplacement : valide à 8 sur 10, invalide sous 5 sur 10', () => {
    expect(verdict(8, 10, SEUILS.unSeulDeplacement)).toBe('VALIDE')
    expect(verdict(4, 10, SEUILS.unSeulDeplacement)).toBe('INVALIDE')
    expect(verdict(6, 10, SEUILS.unSeulDeplacement)).toBe('A_APPROFONDIR')
  })
})
