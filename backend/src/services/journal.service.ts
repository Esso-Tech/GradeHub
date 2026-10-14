import type { Prisma, StatutDemande } from '@prisma/client'

type Db = Prisma.TransactionClient

export interface EvenementInput {
  type: string
  statutAvant?: StatutDemande
  statutApres?: StatutDemande
  message?: string
  auteurId?: string | null
}

/** Journal daté par demande : chaque événement est horodaté et jamais modifié. */
export function enregistrer(db: Db, demandeId: string, e: EvenementInput) {
  return db.journalEvenement.create({
    data: {
      demandeId,
      type: e.type,
      statutAvant: e.statutAvant,
      statutApres: e.statutApres,
      message: e.message,
      auteurId: e.auteurId ?? null,
    },
  })
}
