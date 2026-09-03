import { UnixTime } from '../types/UnixTime.js'

const PROMISE_TIMEOUT = 30

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
  initialCache?: Map<string, CacheEntry>
  promiseTimeout?: number
}

interface Options {
  key: (string | null | undefined)[]
  ttl: number
  staleWhileRevalidate?: number
  cacheNullish?: boolean
}

export class InMemoryCache {
  private cache: Map<string, CacheEntry>
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
    this.cache = config?.initialCache ?? new Map<string, CacheEntry>()
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

    const promise: Promise<T> = fallback().finally(() => {
      if (this.inFlight.get(key)?.promise === promise) {
        this.inFlight.delete(key)
      }
    })
    this.inFlight.set(key, { promise, timestamp: now })

    this.logger?.info('Cache miss', { key })

    const start = Date.now()
    const fallbackResult = await promise
    const duration = Date.now() - start

    const stored = this.store(key, fallbackResult, options)
    this.logger?.info(stored ? 'Cache set' : 'Cache not stored', {
      key,
      duration,
    })

    return fallbackResult
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

    try {
      const promise: Promise<T> = fallback().finally(() => {
        if (this.inFlight.get(key)?.promise === promise) {
          this.inFlight.delete(key)
        }
      })
      this.inFlight.set(key, { promise, timestamp: UnixTime.now() })

      this.store(key, await promise, options)
    } catch (error) {
      // If revalidation fails, we keep the stale data
      this.logger?.warn('Cache revalidation failed', {
        key,
        error,
      })
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
  // string as a different combination.
  private getKey(key: (string | null | undefined)[]) {
    let encoded = ''
    for (const part of key) {
      const value = part ?? ''
      encoded += `${value.length}:${value}`
    }
    return encoded
  }
}
