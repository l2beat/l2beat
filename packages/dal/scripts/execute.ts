import { getEnv, Logger } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Cache } from '../src/cache/Cache'
import { QueryExecutor } from '../src/QueryExecutor'
import { getPackageHash } from '../src/utils/packageHash'

main().catch((err) => console.error(err))

async function main() {
  const logger = Logger.INFO

  const db = getDb()
  const cache = getCache()

  const rollups = await getRollups()
  const queryExecutor = new QueryExecutor(db, logger, cache)
  const to = UnixTime.toStartOf(UnixTime.now() - 1, 'hour')

  try {
    const result = await queryExecutor.execute(
      {
        name: 'getSummedByTimestampTvsValuesQuery',
        args: [rollups, [to, to - UnixTime.DAY * 30], true, false, false],
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
  const packageHash = getPackageHash({
    redisUrl,
  })
  return new Cache(redisUrl, packageHash)
}
