import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Cache } from './cache/Cache'
import { QueryExecutor } from './QueryExecutor'
import { getPackageHash } from './utils/packageHash'

type Options = {
  redisUrl: string | undefined
  // Pass here ENVs that may change the data queried by the query executor
  db: Database
  logger: Logger
  ci: boolean
  envs?: Record<string, unknown>
}

export function makeQueryExecutor({ redisUrl, db, logger, envs, ci }: Options) {
  let cache: Cache | undefined
  if (redisUrl) {
    const packageHash = getPackageHash(db.url, envs)
    cache = new Cache(redisUrl, packageHash)
  }
  return new QueryExecutor(db, logger, cache, ci)
}

export {
  type ProjectWithRanges,
  type SummedByTimestampTvsValuesRecord,
} from './queries/tvl/getSummedByTimestampTvsValuesQuery'
export type { QueryExecutor }
