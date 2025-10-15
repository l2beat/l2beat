import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Cache } from './cache/Cache'
import { QueryExecutor } from './QueryExecutor'

type Options = {
  redisUrl: string | undefined
  db: Database
  logger: Logger
}

export function makeQueryExecutor({ redisUrl, db, logger }: Options) {
  let cache: Cache | undefined
  if (redisUrl) {
    cache = new Cache(redisUrl)
  }
  return new QueryExecutor(db, logger, cache)
}

export { type SummedByTimestampTvsValuesRecord } from './queries/tvl/getSummedByTimestampTvsValuesQuery'
