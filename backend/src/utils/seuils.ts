/**
 * Seuils du plan de test MVP. Fixés avant le test : ne pas les réviser après les résultats.
 * Le seuil d'invalidation « document obtenu » (< 5 sur 10 sous 3 semaines) est la
 * recommandation du coach, à confirmer.
 */
export const SEUILS = {
  paiement: { validation: 5 / 15, invalidation: 2 / 15 },
  unSeulDeplacement: { validation: 8 / 10, invalidation: 5 / 10 },
  documentObtenu: { validation: 8 / 10, invalidation: 5 / 10, delaiJours: 21 },
  echantillonMin: 10,
} as const

export type Verdict = 'VALIDE' | 'INVALIDE' | 'A_APPROFONDIR' | 'ECHANTILLON_INSUFFISANT'

export function verdict(
  nombre: number,
  total: number,
  seuil: { validation: number; invalidation: number },
  echantillonMin: number = SEUILS.echantillonMin,
): Verdict {
  if (total < echantillonMin) return 'ECHANTILLON_INSUFFISANT'
  const ratio = nombre / total
  if (ratio >= seuil.validation) return 'VALIDE'
  if (ratio < seuil.invalidation) return 'INVALIDE'
  return 'A_APPROFONDIR'
}
