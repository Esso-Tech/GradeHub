import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db'
import { HttpError } from '../utils/errors'
import { lireContact, lireServices } from './site.content'
import type { ContactSite, ServicesSite } from '../validators/site.schema'

export async function lireSite() {
  const lignes = await prisma.reglageSite.findMany({ where: { cle: { in: ['contact', 'services'] } } })
  const parCle = new Map(lignes.map((l) => [l.cle, l.valeur]))
  return { contact: lireContact(parCle.get('contact')), services: lireServices(parCle.get('services')) }
}

function enregistrer(cle: 'contact' | 'services', valeur: ContactSite | ServicesSite) {
  const json = valeur as unknown as Prisma.InputJsonValue
  return prisma.reglageSite.upsert({ where: { cle }, update: { valeur: json }, create: { cle, valeur: json } })
}

export async function enregistrerContact(valeur: ContactSite) {
  await enregistrer('contact', valeur)
  return lireSite()
}

export async function enregistrerServices(valeur: ServicesSite) {
  await enregistrer('services', valeur)
  return lireSite()
}

export function creerMessage(data: { nom: string; contact: string; sujet: string; message: string }) {
  return prisma.messageContact.create({ data })
}

export function listerMessages() {
  return prisma.messageContact.findMany({ orderBy: [{ lu: 'asc' }, { createdAt: 'desc' }], take: 200 })
}

export async function marquerMessage(id: string, lu: boolean) {
  const existant = await prisma.messageContact.findUnique({ where: { id } })
  if (!existant) throw new HttpError(404, 'Message introuvable')
  return prisma.messageContact.update({ where: { id }, data: { lu } })
}
