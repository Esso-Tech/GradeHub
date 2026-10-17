/**
 * Client PayGate Global : intégrateur de paiement mobile au Togo (T-Money / Togocom, Flooz / Moov Africa).
 * https://paygateglobal.com : compte à activer, le guide d'intégration est dans le tableau de bord.
 *
 * Endpoints utilisés (base configurable via PAYGATE_BASE_URL) :
 *   POST /api/v1/pay      → lance le paiement : le client reçoit une demande de confirmation sur son téléphone
 *   POST /api/v2/status   → état d'un paiement, retrouvé par notre identifiant
 *
 * Ce module ne dépend ni de la base ni de la configuration : tout est passé en paramètre (testable).
 */

export class PaygateError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
  ) {
    super(message)
    this.name = 'PaygateError'
  }
}

export interface PaygateConfig {
  baseUrl: string
  authToken: string
  timeoutMs: number
}
export type ReseauPaygate = 'FLOOZ' | 'TMONEY'
export type StatutPaygate = 'CONFIRME' | 'EN_ATTENTE' | 'ECHOUE' | 'REFUSE'
type Fetch = typeof fetch

/** PayGate attend le numéro togolais à 8 chiffres, sans indicatif. */
export function normaliserTelephone(brut: string): string {
  let d = brut.replace(/\D/g, '')
  if (d.startsWith('00228')) d = d.slice(5)
  else if (d.startsWith('228') && d.length === 11) d = d.slice(3)
  if (!/^\d{8}$/.test(d)) throw new PaygateError('Numéro invalide : 8 chiffres attendus (ex. 90 00 00 00).')
  return d
}

const MESSAGES_INITIATION: Record<number, string> = {
  2: "Le jeton d'authentification PayGate est invalide (configuration du serveur).",
  4: "Paiement refusé par PayGate : vérifiez le numéro et l'opérateur choisi.",
  6: 'Cette transaction existe déjà.',
}

/** Réponse de /pay : status 0 = transaction enregistrée (tx_reference fourni). */
export function interpreterInitiation(json: unknown): { txReference: string } {
  const j = (json ?? {}) as Record<string, unknown>
  const code = Number(j.status)
  if (code === 0 && typeof j.tx_reference === 'string' && j.tx_reference) {
    return { txReference: j.tx_reference }
  }
  throw new PaygateError(
    MESSAGES_INITIATION[code] ?? 'Le paiement a été refusé par PayGate.',
    Number.isFinite(code) ? code : undefined,
  )
}

export interface EtatPaygate {
  statut: StatutPaygate
  txReference?: string
  montantXof?: number
  methode?: string
}

/** Réponse de /status : 0 = payé, 2 = en cours, 4 = expiré, 6 = annulé. */
export function interpreterStatut(json: unknown): EtatPaygate {
  const j = (json ?? {}) as Record<string, unknown>
  const code = Number(j.status)
  const montant = j.amount != null ? Number(j.amount) : NaN
  const base = {
    txReference: typeof j.tx_reference === 'string' ? j.tx_reference : undefined,
    montantXof: Number.isFinite(montant) ? Math.round(montant) : undefined,
    methode: typeof j.payment_method === 'string' ? j.payment_method : undefined,
  }
  switch (code) {
    case 0: return { statut: 'CONFIRME', ...base }
    case 2: return { statut: 'EN_ATTENTE', ...base }
    case 4: return { statut: 'ECHOUE', ...base }
    case 6: return { statut: 'REFUSE', ...base }
    default: throw new PaygateError('Réponse PayGate inattendue.')
  }
}

async function post(cfg: PaygateConfig, chemin: string, corps: Record<string, unknown>, fetchImpl: Fetch) {
  const ctrl = new AbortController()
  const minuteur = setTimeout(() => ctrl.abort(), cfg.timeoutMs)
  try {
    const r = await fetchImpl(`${cfg.baseUrl.replace(/\/$/, '')}${chemin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ auth_token: cfg.authToken, ...corps }),
      signal: ctrl.signal,
    })
    if (!r.ok) throw new PaygateError(`PayGate indisponible (HTTP ${r.status}).`)
    return (await r.json()) as unknown
  } catch (err) {
    if (err instanceof PaygateError) throw err
    const delai = err instanceof Error && err.name === 'AbortError'
    throw new PaygateError(
      delai ? 'PayGate ne répond pas. Réessayez dans un instant.' : 'PayGate est injoignable. Réessayez dans un instant.',
    )
  } finally {
    clearTimeout(minuteur)
  }
}

export async function initierPaygate(
  cfg: PaygateConfig,
  p: { montantXof: number; telephone: string; reseau: ReseauPaygate; identifier: string; description: string },
  fetchImpl: Fetch = fetch,
) {
  const json = await post(
    cfg,
    '/api/v1/pay',
    {
      phone_number: normaliserTelephone(p.telephone),
      amount: p.montantXof,
      description: p.description,
      identifier: p.identifier,
      network: p.reseau,
    },
    fetchImpl,
  )
  return interpreterInitiation(json)
}

/** Interroge PayGate : c'est la source de vérité, on ne se fie jamais au seul appel de rappel. */
export async function verifierPaygate(cfg: PaygateConfig, identifier: string, fetchImpl: Fetch = fetch) {
  const json = await post(cfg, '/api/v2/status', { identifier }, fetchImpl)
  return interpreterStatut(json)
}
