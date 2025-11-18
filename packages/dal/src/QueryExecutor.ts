import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Cache } from './cache/Cache'
import { type Query, type QueryOf, type QueryResult, queries } from './queries'
import type { DropFirst } from './queries/types'

const DEFAULT_EXPIRATION = 30 * 60 // 30 minutes
const PROMISE_TIMEOUT = 30

export class QueryExecutor {
  private inFlight = new Map<
    string,
    { promise: Promise<unknown>; timestamp: number }
  >()

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly cache: Cache | undefined,
    ci?: boolean,
  ) {
    this.logger = logger.for(this)
    if (ci) {
      this.logger = this.logger.tag({ tag: 'CI' })
    }
  }

  async execute<Q extends Query>(
    query: Q,
    expires?: number,
  ): Promise<QueryResult<Q['name']>> {
    if (!this.cache) {
      return this.executeRawQuery(query) as Promise<QueryResult<Q['name']>>
    }
    const key = this.cache.generateKey(query.name, query.args)

    this.logger.info('Checking cache', {
      name: query.name,
      params: JSON.stringify(query.args),
      key,
    })

    let start = Date.now()

    const cached = await this.cache.read(key)
    if (cached) {
      const end = Date.now()
      this.logger.info('Cache hit', {
        name: query.name,
        params: JSON.stringify(query.args),
        duration: end - start,
      })
      return cached.data as QueryResult<Q['name']>
    }

    this.logger.info('Cache miss', {
      name: query.name,
      params: JSON.stringify(query.args),
    })

    start = Date.now()

    // If no valid data exists, wait for fresh data
    const existingPromise = this.inFlight.get(key)
    if (
      existingPromise &&
      existingPromise.timestamp + PROMISE_TIMEOUT > start
    ) {
      this.logger.info('Reusing in-flight query')
      return existingPromise.promise as Promise<QueryResult<Q['name']>>
    }

    const promise = this.executeRawQuery(query).finally(() => {
      this.inFlight.delete(key)
    })
    this.inFlight.set(key, { promise, timestamp: start })

    const result = await promise

    let end = Date.now()
    this.logger.info('Received data from DB', {
      name: query.name,
      params: JSON.stringify(query.args),
      duration: end - start,
    })

    start = Date.now()

    await this.cache.write(
      key,
      JSON.stringify(result),
      expires ?? DEFAULT_EXPIRATION,
    )

    end = Date.now()
    this.logger.info('Wrote to cache', {
      name: query.name,
      params: JSON.stringify(query.args),
      duration: end - start,
      expires: expires ?? DEFAULT_EXPIRATION,
    })
    return result as QueryResult<Q['name']>
  }

  executeRawQuery<N extends Query['name']>(
    query: QueryOf<N>,
  ): Promise<QueryResult<N>> {
    const fn = queries[query.name] as (
      db: Database,
      ...params: DropFirst<Parameters<(typeof queries)[N]>>
      // biome-ignore lint/suspicious/noExplicitAny: need any here
    ) => any

    return fn(this.db, ...query.args)
  }
}
