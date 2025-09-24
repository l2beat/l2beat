import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { Cache } from './cache/Cache'
import { type Query, type QueryOf, type QueryResult, queries } from './queries'
import type { DropFirst, Simplify } from './queries/types'

const DEFAULT_EXPIRATION = 60 // 1 minute

export type QueryResultWithTimestamp<N extends Query['name']> = {
  data: QueryResult<N>
  timestamp: number
}

export class QueryExecutor {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly cache: Cache,
  ) {
    this.logger = logger.for(this)
  }

  async execute<Q extends Query>(
    query: Q,
    expires?: number,
  ): Promise<Simplify<QueryResultWithTimestamp<Q['name']>>> {
    const key = this.cache.generateKey(query.name, query.args)

    this.logger.info(`Checking cache (key: ${key})`)

    let start = Date.now()

    const cached = await this.cache.read(key)
    if (cached) {
      const end = Date.now()
      this.logger.info(`Cache hit! Took ${end - start}ms`)
      return cached as QueryResultWithTimestamp<Q['name']>
    }

    this.logger.info('Cache miss, querying DB...')

    start = Date.now()

    const result = await this.executeRawQuery(query)

    let end = Date.now()
    this.logger.info(`Getting data from DB took ${end - start}ms`)

    start = Date.now()

    this.logger.info(
      `Writing to cache (will expire in ${expires ?? DEFAULT_EXPIRATION} seconds)`,
    )

    await this.cache.write(
      key,
      JSON.stringify(result),
      expires ?? DEFAULT_EXPIRATION,
    )

    end = Date.now()
    this.logger.info(`Writing to cache took ${end - start}ms`)

    return {
      data: result as QueryResult<Q['name']>,
      timestamp: UnixTime.now(),
    }
  }

  executeRawQuery<N extends Query['name']>(
    query: QueryOf<N>,
  ): Promise<QueryResult<N>> {
    const fn = queries[query.name] as (
      db: Database,
      ...args: DropFirst<Parameters<(typeof queries)[N]>>
      // biome-ignore lint/suspicious/noExplicitAny: need any here
    ) => any

    return fn(this.db, ...query.args)
  }
}
