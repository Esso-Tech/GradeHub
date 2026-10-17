import { describe, expect, it } from 'vitest'
import { contactSchema, messageContactSchema, servicesSchema } from '../src/validators/site.schema'
import { CONTACT_PAR_DEFAUT, SERVICES_PAR_DEFAUT, lireContact, lireServices } from '../src/services/site.content'

describe('coordonnées du site', () => {
  it('accepte des champs vides (rien n\'est affiché)', () => {
    expect(contactSchema.parse({})).toEqual(CONTACT_PAR_DEFAUT)
  })
  it('accepte des coordonnées valides', () => {
    const r = contactSchema.safeParse({ phone: '+228 90 00 00 00', email: 'contact@exemple.tg', address: 'Lomé' })
    expect(r.success).toBe(true)
  })
  it('refuse un e-mail ou un numéro invalide', () => {
    expect(contactSchema.safeParse({ email: 'pas-un-email' }).success).toBe(false)
    expect(contactSchema.safeParse({ phone: 'abc' }).success).toBe(false)
  })
})

describe('services du site', () => {
  it('le contenu par défaut est valide', () => {
    expect(servicesSchema.safeParse(SERVICES_PAR_DEFAUT).success).toBe(true)
  })
  it('refuse un titre vide ou trop de cartes', () => {
    const vide = { titre: '', texte: 'x', etiquette: '', important: false }
    expect(servicesSchema.safeParse({ documents: [vide], inclus: [] }).success).toBe(false)
    const ok = { titre: 'A', texte: 'x', etiquette: '', important: false }
    expect(servicesSchema.safeParse({ documents: Array(13).fill(ok), inclus: [] }).success).toBe(false)
  })
  it('une valeur stockée illisible retombe sur le contenu par défaut', () => {
    expect(lireServices({ nimporte: 'quoi' })).toEqual(SERVICES_PAR_DEFAUT)
    expect(lireServices(undefined)).toEqual(SERVICES_PAR_DEFAUT)
    expect(lireContact(42)).toEqual(CONTACT_PAR_DEFAUT)
  })
  it('lit un contenu enregistré valide', () => {
    const perso = { documents: [{ titre: 'Certificat', texte: 'Texte', etiquette: '', important: true }], inclus: [] }
    expect(lireServices(perso).documents[0].titre).toBe('Certificat')
  })
})

describe('message de contact', () => {
  const base = { nom: 'Kafui', contact: '+228 90 00 00 00', sujet: 'Un paiement', message: 'Bonjour, une question.' }
  it('accepte un message complet', () => {
    expect(messageContactSchema.safeParse(base).success).toBe(true)
  })
  it('refuse un message trop court ou sans nom', () => {
    expect(messageContactSchema.safeParse({ ...base, message: 'ok' }).success).toBe(false)
    expect(messageContactSchema.safeParse({ ...base, nom: '' }).success).toBe(false)
  })
})
