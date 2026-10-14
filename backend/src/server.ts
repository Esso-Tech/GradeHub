import { app } from './app'
import { env } from './config/env'
import { prisma } from './config/db'
import { planifierRappels } from './jobs/rappels.job'
import { planifierPurge } from './jobs/purge.job'
import { logger } from './utils/logger'

const server = app.listen(env.PORT, () => {
  logger.info(`GRADE HUB API sur le port ${env.PORT}`)
  planifierRappels()
  planifierPurge()
})

async function arret() {
  server.close()
  await prisma.$disconnect()
  process.exit(0)
}
process.on('SIGINT', arret)
process.on('SIGTERM', arret)
