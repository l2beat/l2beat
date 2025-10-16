import { makeQueryExecutor } from '@l2beat/dal'
import { env } from '~/env'
import { getDb } from './database'
import { getLogger } from './utils/logger'

export const queryExecutor = makeQueryExecutor({
  redisUrl: env.REDIS_URL,
  db: getDb(),
  logger: getLogger(),
  env,
  ci: process.env.CI === 'true',
})
