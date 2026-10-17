import { describe, expect, it, vi } from 'vitest'
import {
  PaygateError,
  initierPaygate,
  interpreterInitiation,
  interpreterStatut,
  normaliserTelephone,
  verifierPaygate,
} from '../src/integrations/paygate.client'

const cfg = { baseUrl: 'https://paygate.test/', authToken: 'jeton-secret-123', timeoutMs: 1000 }
const reponse = (corps: unknown, ok = true, status = 200) =>
  ({ ok, status, json: async () => corps }) as Response

describe('numéro de téléphone', () => {
  it('garde 8 chiffres, avec ou sans indicatif', () => {
    expect(normaliserTelephone('90 12 34 56')).toBe('90123456')
    expect(normaliserTelephone('+228 90 12 34 56')).toBe('90123456')
    expect(normaliserTelephone('00228 90123456')).toBe('90123456')
    expect(normaliserTelephone('22890123456')).toBe('90123456')
  })
  it('refuse un numéro trop court ou trop long', () => {
    expect(() => normaliserTelephone('1234')).toThrow(PaygateError)
    expect(() => normaliserTelephone('901234567')).toThrow(PaygateError)
  })
})

describe('lancement du paiement', () => {
  it('lit la référence quand PayGate enregistre la transaction', () => {
    expect(interpreterInitiation({ status: 0, tx_reference: 'TX-1' })).toEqual({ txReference: 'TX-1' })
  })
  it('traduit les codes d\'erreur', () => {
    expect(() => interpreterInitiation({ status: 2 })).toThrow(/jeton/i)
    expect(() => interpreterInitiation({ status: 4 })).toThrow(/numéro/i)
    expect(() => interpreterInitiation({ status: 6 })).toThrow(/existe déjà/i)
    expect(() => interpreterInitiation({})).toThrow(PaygateError)
  })
  it('envoie le bon corps à /api/v1/pay', async () => {
    const f = vi.fn().mockResolvedValue(reponse({ status: 0, tx_reference: 'TX-9' }))
    const r = await initierPaygate(
      cfg,
      { montantXof: 1500, telephone: '+228 90 12 34 56', reseau: 'FLOOZ', identifier: 'pay_1', description: 'GRADE HUB GH-1' },
      f as unknown as typeof fetch,
    )
    expect(r.txReference).toBe('TX-9')
    const [url, init] = f.mock.calls[0]
    expect(url).toBe('https://paygate.test/api/v1/pay')
    expect(JSON.parse(init.body)).toEqual({
      auth_token: 'jeton-secret-123',
      phone_number: '90123456',
      amount: 1500,
      description: 'GRADE HUB GH-1',
      identifier: 'pay_1',
      network: 'FLOOZ',
    })
  })
  it('signale PayGate indisponible sans fuite du jeton', async () => {
    const f = vi.fn().mockResolvedValue(reponse({}, false, 503))
    const err = await initierPaygate(
      cfg,
      { montantXof: 1500, telephone: '90123456', reseau: 'TMONEY', identifier: 'p', description: 'd' },
      f as unknown as typeof fetch,
    ).catch((e) => e)
    expect(err).toBeInstanceOf(PaygateError)
    expect(err.message).not.toContain('jeton-secret-123')
  })
  it('traduit une coupure réseau en message clair', async () => {
    const f = vi.fn().mockRejectedValue(new TypeError('fetch failed'))
    await expect(
      initierPaygate(cfg, { montantXof: 1500, telephone: '90123456', reseau: 'TMONEY', identifier: 'p', description: 'd' }, f as unknown as typeof fetch),
    ).rejects.toThrow(/injoignable/i)
  })
})

describe('vérification du statut', () => {
  it('traduit les quatre statuts de paiement', () => {
    expect(interpreterStatut({ status: 0 }).statut).toBe('CONFIRME')
    expect(interpreterStatut({ status: 2 }).statut).toBe('EN_ATTENTE')
    expect(interpreterStatut({ status: 4 }).statut).toBe('ECHOUE')
    expect(interpreterStatut({ status: 6 }).statut).toBe('REFUSE')
  })
  it('lit le montant, même reçu en texte', () => {
    expect(interpreterStatut({ status: 0, amount: '1500' }).montantXof).toBe(1500)
    expect(interpreterStatut({ status: 0, amount: 1500 }).montantXof).toBe(1500)
    expect(interpreterStatut({ status: 0 }).montantXof).toBeUndefined()
  })
  it('refuse une réponse inconnue plutôt que de deviner', () => {
    expect(() => interpreterStatut({ status: 99 })).toThrow(PaygateError)
    expect(() => interpreterStatut(null)).toThrow(PaygateError)
  })
  it('interroge /api/v2/status avec notre identifiant', async () => {
    const f = vi.fn().mockResolvedValue(reponse({ status: 0, tx_reference: 'TX-1', amount: 1500 }))
    const r = await verifierPaygate(cfg, 'pay_1', f as unknown as typeof fetch)
    expect(r).toMatchObject({ statut: 'CONFIRME', montantXof: 1500 })
    const [url, init] = f.mock.calls[0]
    expect(url).toBe('https://paygate.test/api/v2/status')
    expect(JSON.parse(init.body)).toEqual({ auth_token: 'jeton-secret-123', identifier: 'pay_1' })
  })
})
