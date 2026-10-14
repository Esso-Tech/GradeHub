import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@gradehub.local'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe-12345'

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      nom: 'Administrateur GRADE HUB',
      telephone: '+22800000000',
      passwordHash: await bcrypt.hash(password, 12),
      role: 'ADMIN',
    },
  })

  // Établissement fictif : à remplacer par les établissements réels
  // dès qu'un accord écrit est obtenu.
  const existe = await prisma.etablissement.findFirst({ where: { nom: 'Établissement pilote (à renseigner)' } })
  if (!existe) {
    await prisma.etablissement.create({
      data: { nom: 'Établissement pilote (à renseigner)', type: 'PUBLIC', ville: 'Lomé' },
    })
  }
  console.log('Seed terminé.')
}

main().finally(() => prisma.$disconnect())
