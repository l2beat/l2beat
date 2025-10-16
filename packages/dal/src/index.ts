import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Cache } from './cache/Cache'
import { QueryExecutor } from './QueryExecutor'
import { getPackageHash } from './utils/packageHash'

type Options = {
  redisUrl: string | undefined
  env: Record<string, unknown>
  db: Database
  logger: Logger
  ci: boolean
}

export function makeQueryExecutor({ redisUrl, db, logger, env, ci }: Options) {
  let cache: Cache | undefined
  if (redisUrl) {
    const packageHash = getPackageHash(env)
    cache = new Cache(redisUrl, packageHash)
  }
  return new QueryExecutor(db, logger, cache, ci)
}

export { type SummedByTimestampTvsValuesRecord } from './queries/tvl/getSummedByTimestampTvsValuesQuery'
