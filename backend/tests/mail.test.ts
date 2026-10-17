import { describe, expect, it } from 'vitest'
import { construireEmailNouveauMessage, echapperHtml, emailDeReponse } from '../src/services/mail.templates'

const base = {
  nom: 'Kafui Test',
  contact: 'kafui@exemple.tg',
  sujet: 'Un paiement',
  message: 'Bonjour,\nj\'ai une question.',
  createdAt: new Date('2026-10-16T09:30:00Z'),
}

describe('e-mail de nouveau message', () => {
  it('contient l\'essentiel en texte et en HTML', () => {
    const m = construireEmailNouveauMessage(base, 'https://site.tg/admin/messages')
    expect(m.subject).toBe('[GRADE HUB] Nouveau message : Un paiement')
    for (const part of ['Kafui Test', 'kafui@exemple.tg', 'j\'ai une question', 'https://site.tg/admin/messages']) {
      expect(m.text).toContain(part)
    }
    expect(m.html).toContain('Ouvrir les messages')
  })
  it('neutralise le HTML saisi par le visiteur', () => {
    const m = construireEmailNouveauMessage(
      { ...base, nom: '<script>alert(1)</script>', message: '<img src=x onerror=alert(1)>' },
      'https://site.tg/admin/messages',
    )
    expect(m.html).not.toContain('<script>')
    expect(m.html).not.toContain('<img')
    expect(m.html).toContain('&lt;script&gt;')
  })
  it('empêche l\'injection d\'en-têtes via le sujet', () => {
    const m = construireEmailNouveauMessage({ ...base, sujet: 'Sujet\r\nBcc: pirate@x.tg' }, 'https://s.tg')
    expect(m.subject).not.toMatch(/[\r\n]/)
  })
  it('échappe les caractères spéciaux', () => {
    expect(echapperHtml(`<a href="x">&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;')
  })
})

describe('adresse de réponse', () => {
  it('répond directement au visiteur seulement si c\'est un e-mail', () => {
    expect(emailDeReponse('kafui@exemple.tg')).toBe('kafui@exemple.tg')
    expect(emailDeReponse('+228 90 00 00 00')).toBeUndefined()
    expect(emailDeReponse('pas un email')).toBeUndefined()
  })
})
