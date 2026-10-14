import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { prisma } from '../config/db'
import { env } from '../config/env'
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
