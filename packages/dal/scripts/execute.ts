import { getEnv, LogFormatterPretty, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { Cache } from '../src/cache/Cache'
import { QueryExecutor } from '../src/QueryExecutor'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const logger = getLogger()
  const db = getDb()
  const cache = getCache()

  const rollups = await getRollups()
  const queryExecutor = new QueryExecutor(db, logger, cache)

  try {
    const result = await queryExecutor.execute(
      {
        name: 'getTvsChartQuery',
        args: [rollups],
      },
      10,
    )

    const size = Buffer.byteLength(JSON.stringify(result), 'utf8')
    logger.info(`Data size: ${size / 1024} KB`)
  } catch (error) {
    logger.error('Error occurred while fetching TVS chart:', error)
  }

  process.exit(0)
}

async function getRollups() {
  const ps = new ProjectService()

  const projects = await ps.getProjects({
    select: ['tvsConfig', 'scalingInfo'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  return projects
    .filter(
      (project) =>
        project.scalingInfo.type === 'Optimistic Rollup' ||
        project.scalingInfo.type === 'ZK Rollup',
    )
    .map((project) => project.id)
}

export function getDb() {
  const env = getEnv()
  const tvsDbUrl = env.string('DB_URL')

  return createDatabase({
    connectionString: tvsDbUrl,
    application_name: 'DAL-POC',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 10,
    keepAlive: false,
  })
}

export function getCache() {
  const env = getEnv()
  const redisUrl = env.string('REDIS_URL')
  return new Cache(redisUrl)
}

export function getLogger() {
  const logger = new Logger({
    logLevel: 'INFO',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })
  return logger
}
