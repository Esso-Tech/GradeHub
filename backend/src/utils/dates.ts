export const JOUR_MS = 24 * 60 * 60 * 1000

export function joursEntre(debut: Date, fin: Date) {
  return Math.round(((fin.getTime() - debut.getTime()) / JOUR_MS) * 10) / 10
}

export function ajouterJours(date: Date, jours: number) {
  return new Date(date.getTime() + jours * JOUR_MS)
}

export function genererReference(now = new Date()) {
  const d = now.toISOString().slice(0, 10).replace(/-/g, '')
  const suffixe = Math.random().toString(16).slice(2, 6).toUpperCase()
  return `GH-${d}-${suffixe}`
}
