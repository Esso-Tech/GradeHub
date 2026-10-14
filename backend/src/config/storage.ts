import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { env } from './env'

const root = path.resolve(env.STORAGE_DIR)

const EXTENSIONS: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
}

export const MIMES_AUTORISES = Object.keys(EXTENSIONS)

/** Enregistre un scan hors de tout dossier public. Retourne la clé de stockage. */
export async function sauvegarderScan(demandeId: string, buffer: Buffer, mimeType: string) {
  const ext = EXTENSIONS[mimeType]
  if (!ext) throw new Error('Type de fichier non autorisé')

  const key = path.join(demandeId, `${crypto.randomUUID()}${ext}`)
  const full = resoudre(key)
  await fs.promises.mkdir(path.dirname(full), { recursive: true })
  await fs.promises.writeFile(full, buffer, { mode: 0o600 })
  return key
}

export function lireScan(key: string) {
  return fs.createReadStream(resoudre(key))
}

export async function supprimerScan(key: string) {
  await fs.promises.rm(resoudre(key), { force: true })
}

// Empêche toute sortie du dossier de stockage (path traversal)
function resoudre(key: string) {
  const full = path.resolve(root, key)
  if (!full.startsWith(root + path.sep)) throw new Error('Chemin invalide')
  return full
}
