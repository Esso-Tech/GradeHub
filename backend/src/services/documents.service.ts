import jwt from 'jsonwebtoken'
import { prisma } from '../config/db'
import { env } from '../config/env'
import { sauvegarderScan, supprimerScan } from '../config/storage'
import { HttpError } from '../utils/errors'
import * as journal from './journal.service'
import { changerStatut } from './demandes.service'

export async function enregistrerScan(
  demandeId: string,
  auteurId: string,
  fichier: { buffer: Buffer; mimetype: string; size: number },
) {
  const demande = await prisma.demande.findUnique({ where: { id: demandeId } })
  if (!demande) throw new HttpError(404, 'Demande introuvable')
  if (demande.statut !== 'SIGNEE' && demande.statut !== 'SCAN_ENVOYE') {
    throw new HttpError(409, "Le scan s'ajoute une fois le document signé")
  }

  const storageKey = await sauvegarderScan(demandeId, fichier.buffer, fichier.mimetype)
  const doc = await prisma.document.create({
    data: { demandeId, storageKey, mimeType: fichier.mimetype, tailleOctets: fichier.size },
  })
  await journal.enregistrer(prisma, demandeId, { type: 'SCAN_AJOUTE', auteurId })

  if (demande.statut === 'SIGNEE') {
    await changerStatut(demandeId, 'SCAN_ENVOYE', auteurId, 'Scan déposé')
  }
  return doc
}

/** Lien de téléchargement signé et de courte durée. */
export async function creerLienSigne(demandeId: string) {
  const doc = await prisma.document.findFirst({
    where: { demandeId, supprimeLe: null },
    orderBy: { createdAt: 'desc' },
  })
  if (!doc) throw new HttpError(404, 'Aucun scan disponible')

  const token = jwt.sign({ docId: doc.id, purpose: 'download' }, env.JWT_SECRET, {
    expiresIn: env.SIGNED_URL_TTL_SECONDS,
  })
  return { token, expireDansSecondes: env.SIGNED_URL_TTL_SECONDS }
}

export async function documentDepuisToken(token: string) {
  let payload: { docId?: string; purpose?: string }
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as typeof payload
  } catch {
    throw new HttpError(401, 'Lien expiré ou invalide')
  }
  if (payload.purpose !== 'download' || !payload.docId) throw new HttpError(401, 'Lien invalide')

  const doc = await prisma.document.findUnique({ where: { id: payload.docId } })
  if (!doc || doc.supprimeLe) throw new HttpError(404, 'Document introuvable')
  return doc
}

/** Supprime les scans des demandes clôturées depuis plus de RETENTION_SCANS_JOURS. */
export async function purgerScansExpires(now = new Date()) {
  const limite = new Date(now.getTime() - env.RETENTION_SCANS_JOURS * 24 * 60 * 60 * 1000)
  const docs = await prisma.document.findMany({
    where: { supprimeLe: null, demande: { clotureeLe: { lt: limite } } },
  })
  for (const d of docs) {
    await supprimerScan(d.storageKey)
    await prisma.document.update({ where: { id: d.id }, data: { supprimeLe: now } })
  }
  return docs.length
}
