import { describe, expect, it } from 'vitest'
import {
  calculerDelaiAnnonce, calculerFrais, estAncien, expressDisponible,
} from '../src/services/tarification.service'

const cfg = { fraisSuiviXof: 1500, fraisExpressXof: 0, majorationAncienPourcent: 50, ancienneteSeuilAnnees: 2 }

describe('tarification', () => {
  it('facture 1 500 F CFA de suivi', () => {
    expect(calculerFrais(false, cfg).totalXof).toBe(1500)
  })

  it("refuse l'express tant que son prix n'est pas fixé", () => {
    expect(expressDisponible(cfg)).toBe(false)
    expect(expressDisponible({ ...cfg, fraisExpressXof: 1000 })).toBe(true)
  })

  it('ajoute le supplément express quand il existe', () => {
    expect(calculerFrais(true, { ...cfg, fraisExpressXof: 1000 }).totalXof).toBe(2500)
  })

  it('détecte un document de plus de deux ans', () => {
    const now = new Date('2026-10-13')
    expect(estAncien(2023, 2, now)).toBe(true)
    expect(estAncien(2024, 2, now)).toBe(false)
  })

  it("n'annonce aucun délai tant qu'il n'est pas mesuré", () => {
    expect(calculerDelaiAnnonce(null, false, 50)).toBeNull()
    expect(calculerDelaiAnnonce(null, true, 50)).toBeNull()
  })

  it('majore le délai de 50 % pour un document ancien', () => {
    expect(calculerDelaiAnnonce(10, false, 50)).toBe(10)
    expect(calculerDelaiAnnonce(10, true, 50)).toBe(15)
    expect(calculerDelaiAnnonce(7, true, 50)).toBe(11)
  })
})
