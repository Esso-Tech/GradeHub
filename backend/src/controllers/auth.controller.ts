import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { prisma } from '../config/db'
import { env } from '../config/env'
import { supprimerScan } from '../config/storage'
import { HttpError } from '../utils/errors'

function signer(user: { id: string; role: string }) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

const publicUser = (u: { id: string; nom: string; email: string; telephone: string; role: string }) => ({
  id: u.id, nom: u.nom, email: u.email, telephone: u.telephone, role: u.role,
})

export async function register(req: Request, res: Response) {
  const { nom, email, telephone, motDePasse } = req.body
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new HttpError(409, 'Un compte existe déjà avec cet e-mail')
  }
  const user = await prisma.user.create({
    data: { nom, email, telephone, passwordHash: await bcrypt.hash(motDePasse, 12) },
  })
  res.status(201).json({ token: signer(user), user: publicUser(user) })
}

export async function login(req: Request, res: Response) {
  const { email, motDePasse } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  // Même message dans les deux cas pour ne pas révéler quels e-mails existent
  if (!user || !(await bcrypt.compare(motDePasse, user.passwordHash))) {
    throw new HttpError(401, 'E-mail ou mot de passe incorrect')
  }
  res.json({ token: signer(user), user: publicUser(user) })
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) throw new HttpError(404, 'Utilisateur introuvable')
  res.json(publicUser(user))
}

export async function mettreAJourProfil(req: Request, res: Response) {
  const userId = req.user!.id
  const { nom, email, telephone } = req.body as { nom: string; email: string; telephone: string }

  if (await prisma.user.findFirst({ where: { email, id: { not: userId } } })) {
    throw new HttpError(409, 'Un compte existe déjà avec cet e-mail')
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { nom, email, telephone },
  })
  res.json(publicUser(user))
}

export async function supprimerCompte(req: Request, res: Response) {
  const userId = req.user!.id
  const { motDePasse } = req.body as { motDePasse: string }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new HttpError(404, 'Utilisateur introuvable')
  if (user.role === 'ADMIN') {
    throw new HttpError(403, 'La suppression de compte administrateur n\'est pas disponible ici.')
  }
  if (!(await bcrypt.compare(motDePasse, user.passwordHash))) {
    throw new HttpError(401, 'Mot de passe incorrect')
  }

  const actives = await prisma.demande.count({
    where: {
      userId,
      statut: { notIn: ['CLOTUREE', 'ANNULEE'] },
    },
  })
  if (actives > 0) {
    throw new HttpError(
      409,
      'Des demandes sont encore en cours. Clôturez-les ou annulez-les avant de supprimer votre compte.',
    )
  }

  const demandes = await prisma.demande.findMany({
    where: { userId },
    select: { id: true },
  })
  const demandeIds = demandes.map((d) => d.id)

  if (demandeIds.length > 0) {
    const docs = await prisma.document.findMany({
      where: { demandeId: { in: demandeIds }, supprimeLe: null },
    })
    for (const doc of docs) {
      try {
        await supprimerScan(doc.storageKey)
      } catch {
        /* fichier déjà absent */
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    if (demandeIds.length > 0) {
      await tx.demande.deleteMany({ where: { userId } })
    }
    await tx.user.delete({ where: { id: userId } })
  })

  res.status(204).send()
}
