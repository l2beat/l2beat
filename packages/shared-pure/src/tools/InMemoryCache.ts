import { UnixTime } from '../types/UnixTime.js'

const PROMISE_TIMEOUT = 30

// Not a digit, so it can never be read as the length prefix of a string part.
const ABSENT_KEY_PART = '-'

type Logger = {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
  for: (object: object) => Logger
}

interface CacheEntry {
  result: unknown
  timestamp: number
  maxLifetime?: number
}

interface Config {
  logger?: Logger
  enabled?: boolean
  promiseTimeout?: number
}

interface Options {
  key: (string | null | undefined)[]
  ttl: number
  staleWhileRevalidate?: number
  cacheNullish?: boolean
}

export class InMemoryCache {
  private cache = new Map<string, CacheEntry>()
  private enabled
  private promiseTimeout
  private logger
  private lastSweptAt = 0
  private inFlight = new Map<
    string,
    { promise: Promise<unknown>; timestamp: number }
  >()

  constructor(config: Config) {
    this.logger = config.logger
    this.enabled = config?.enabled ?? true
    this.promiseTimeout = config?.promiseTimeout ?? PROMISE_TIMEOUT
  }

  async get<T>(options: Options, fallback: () => Promise<T>): Promise<T> {
    if (!this.enabled) {
      return fallback()
    }

    this.logger?.debug('Getting cache key', { key: options.key })
    const key = this.getKey(options.key)
    const now = UnixTime.now()

    const result = this.cache.get(key)

    this.sweep(now)

    // If we have a result and it's not expired, return it immediately
    if (result && result.timestamp + options.ttl > now) {
      this.logger?.info('Cache hit', { key })
      return result.result as T
    }

    // If we have stale data and staleWhileRevalidate is enabled
    if (
      result &&
      options.staleWhileRevalidate &&
      result.timestamp + options.ttl + options.staleWhileRevalidate > now
    ) {
      this.logger?.info('Cache stale', { key })
      void this.revalidateInBackground(key, options, fallback)
      return result.result as T
    }

    // If no valid data exists, wait for fresh data
    const existingPromise = this.inFlight.get(key)
    if (
      existingPromise &&
      existingPromise.timestamp + this.promiseTimeout > now
    ) {
      this.logger?.info('Cache in flight', { key })
      return existingPromise.promise as Promise<T>
    }

    const promise = fallback()
    this.inFlight.set(key, { promise, timestamp: now })

    this.logger?.info('Cache miss', { key })

    const start = Date.now()
    try {
      const fallbackResult = await promise
      const duration = Date.now() - start

      if (this.inFlight.get(key)?.promise === promise) {
        const stored = this.store(key, fallbackResult, options)
        this.logger?.info(stored ? 'Cache set' : 'Cache not stored', {
          key,
          duration,
        })
      }

      return fallbackResult
    } finally {
      if (this.inFlight.get(key)?.promise === promise) {
        this.inFlight.delete(key)
      }
    }
  }

  private async revalidateInBackground<T>(
    key: string,
    options: Options,
    fallback: () => Promise<T>,
  ): Promise<void> {
    const existingPromise = this.inFlight.get(key)
    if (
      existingPromise &&
      existingPromise.timestamp + this.promiseTimeout > UnixTime.now()
    ) {
      return
    }

    const promise = fallback()
    this.inFlight.set(key, { promise, timestamp: UnixTime.now() })

    try {
      const result = await promise
      if (this.inFlight.get(key)?.promise === promise) {
        this.store(key, result, options)
      }
    } catch (error) {
      // If revalidation fails, we keep the stale data
      this.logger?.warn('Cache revalidation failed', {
        key,
        error,
      })
    } finally {
      if (this.inFlight.get(key)?.promise === promise) {
        this.inFlight.delete(key)
      }
    }
  }

  private store(key: string, result: unknown, options: Options): boolean {
    if (result === undefined || result === null) {
      if (options.cacheNullish !== true) {
        return false
      }
    }

    this.cache.set(key, {
      result,
      timestamp: UnixTime.now(),
      maxLifetime: options.ttl + (options.staleWhileRevalidate ?? 0),
    })
    return true
  }

  private sweep(now: number) {
    // Timestamps are whole seconds, so a second sweep within the same second
    // cannot find anything the first one did not.
    if (now === this.lastSweptAt) {
      return
    }
    this.lastSweptAt = now

    for (const [key, entry] of this.cache) {
      if (
        entry.maxLifetime !== undefined &&
        entry.timestamp + entry.maxLifetime <= now
      ) {
        this.cache.delete(key)
      }
    }
  }

  _get(key: (string | null | undefined)[]) {
    return this.cache.get(this.getKey(key))
  }

  _set(key: (string | null | undefined)[], value: CacheEntry) {
    this.cache.set(this.getKey(key), value)
  }

  // Length-prefixed so that no combination of key parts can produce the same
  // string as a different combination. A length prefix only delimits the part
  // it precedes if the part really is a string, so a part that is not one is
  // rejected here instead of being folded into an ambiguous key. Key parts
  // often come from HTTP request parameters, which TypeScript cannot check.
  private getKey(key: (string | null | undefined)[]) {
    let encoded = ''
    for (const part of key) {
      if (part === null || part === undefined) {
        encoded += ABSENT_KEY_PART
        continue
      }
      if (typeof part !== 'string') {
        throw new TypeError(
          `Cache key part is a ${typeof part}, expected a string`,
        )
      }
      encoded += `${part.length}:${part}`
    }
    return encoded
  }
}
