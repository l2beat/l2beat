import { assertUnreachable } from '@l2beat/shared-pure'
import { getCache, getDb, getLogger } from '../utils'
import { getTvsChartQuery } from './getTvsChartQuery'
import { getTvsTableQuery } from './getTvsTableQuery'
import type { DropFirst } from './types'

type Query =
  | {
      name: 'getTvsChartQuery'
      args: DropFirst<Parameters<typeof getTvsChartQuery>>
      expires?: 10
    }
  | {
      name: 'getTvsTableQuery'
      args: DropFirst<Parameters<typeof getTvsTableQuery>>
      expires?: 10
    }

// Map command `type` to return type
type QueryResult<T extends Query['name']> = T extends 'getTvsChartQuery'
  ? ReturnType<typeof getTvsChartQuery>
  : T extends 'getTvsTableQuery'
    ? ReturnType<typeof getTvsTableQuery>
    : never

export async function execute<Q extends Query>(
  query: Q,
): Promise<QueryResult<Q['name']>> {
  const cache = getCache()
  const logger = getLogger()

  const key = cache.generateKey('getTvsChartQuery', query.args)

  logger.info(`Checking cache (key: ${key})`)

  let start = Date.now()

  const cached = await cache.read(key)
  if (cached) {
    const end = Date.now()
    logger.info(`Cache hit! Took ${end - start}ms`)
    return cached as QueryResult<Q['name']>
  }

  logger.info('Cache miss, querying DB...')

  const db = getDb()
  start = Date.now()

  // biome-ignore lint/suspicious/noExplicitAny: <need any here>
  let result: any
  switch (query.name) {
    case 'getTvsChartQuery':
      result = await getTvsChartQuery(db, ...query.args)
      break
    case 'getTvsTableQuery':
      result = await getTvsTableQuery(db, ...query.args)
      break
    default:
      assertUnreachable(query)
  }

  let end = Date.now()
  logger.info(`Getting data from DB took ${end - start}ms`)

  start = Date.now()

  await cache.write(key, JSON.stringify(result), query.expires)

  end = Date.now()
  logger.info(`Writing to cache took ${end - start}ms`)

  return result
}
