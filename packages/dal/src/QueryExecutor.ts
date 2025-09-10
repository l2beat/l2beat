import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Cache } from './cache/Cache'
import { execute, type Query, type QueryResult } from './queries'

const DEFAULT_EXPIRATION = 60 // 1 minute

export class QueryExecutor {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly cache: Cache,
  ) {}

  async execute<Q extends Query>(
    query: Q,
    expires?: number,
  ): Promise<QueryResult<Q['name']>> {
    const key = this.cache.generateKey('getTvsChartQuery', query.args)

    this.logger.info(`Checking cache (key: ${key})`)

    let start = Date.now()

    const cached = await this.cache.read(key)
    if (cached) {
      const end = Date.now()
      this.logger.info(`Cache hit! Took ${end - start}ms`)
      return cached as QueryResult<Q['name']>
    }

    this.logger.info('Cache miss, querying DB...')

    start = Date.now()

    const result = await execute(this.db, query)

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

    return result as QueryResult<Q['name']>
  }
}
