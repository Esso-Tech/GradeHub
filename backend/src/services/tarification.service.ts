/** Règles de prix et de délai. Fonctions pures : aucune dépendance à la base. */

export interface TarifConfig {
  fraisSuiviXof: number
  fraisExpressXof: number
  majorationAncienPourcent: number
  ancienneteSeuilAnnees: number
}

export function estAncien(anneeSortie: number, seuilAnnees: number, now = new Date()) {
  return now.getFullYear() - anneeSortie > seuilAnnees
}

export function expressDisponible(cfg: TarifConfig) {
  return cfg.fraisExpressXof > 0
}

export function calculerFrais(urgence: boolean, cfg: TarifConfig) {
  const fraisExpress = urgence ? cfg.fraisExpressXof : 0
  return {
    fraisSuiviXof: cfg.fraisSuiviXof,
    fraisExpressXof: fraisExpress,
    totalXof: cfg.fraisSuiviXof + fraisExpress,
  }
}

/**
 * Délai annoncé au client, en jours.
 * Jamais annoncé avant mesure : retourne null tant que l'établissement n'a pas de délai mesuré.
 * Document ancien : délai majoré (50 % par défaut).
 */
export function calculerDelaiAnnonce(
  delaiMesureJours: number | null,
  ancien: boolean,
  majorationPourcent: number,
) {
  if (delaiMesureJours == null) return null
  return ancien ? Math.ceil(delaiMesureJours * (1 + majorationPourcent / 100)) : delaiMesureJours
}
