import { getEnv, type Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Cache } from './cache/Cache'
import { QueryExecutor } from './QueryExecutor'

export function makeQueryExecutor(db: Database, logger: Logger) {
  const env = getEnv()
  const redisUrl = env.string('REDIS_URL')
  const cache = new Cache(redisUrl)
  return new QueryExecutor(db, logger, cache)
}
