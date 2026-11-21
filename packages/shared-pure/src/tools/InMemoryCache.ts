import { UnixTime } from '../types/UnixTime.js'

const PROMISE_TIMEOUT = 30

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

    if (result && result.timestamp + options.ttl > now) {
      this.logger?.info('Cache hit', { key })
      return result.result as T
    }

    if (
      result &&
      options.staleWhileRevalidate &&
      result.timestamp + options.ttl + options.staleWhileRevalidate > now
    ) {
      this.logger?.info('Cache stale', { key })
      void this.revalidateInBackground(key, options, fallback)
      return result.result as T
    }

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

      const stored = this.store(key, fallbackResult, options, now)
      this.logger?.info(stored ? 'Cache set' : 'Cache not stored', {
        key,
        duration,
      })

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

    const startedAt = UnixTime.now()
    const promise = fallback()
    this.inFlight.set(key, { promise, timestamp: startedAt })

    try {
      this.store(key, await promise, options, startedAt)
    } catch (error) {
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

  private store(
    key: string,
    result: unknown,
    options: Options,
    startedAt: number,
  ): boolean {
    if (result === undefined || result === null) {
      if (options.cacheNullish !== true) {
        return false
      }
    }

    const existing = this.cache.get(key)
    if (existing && existing.timestamp >= startedAt) {
      return false
    }

    this.cache.set(key, {
      result,
      timestamp: UnixTime.now(),
      maxLifetime: options.ttl + (options.staleWhileRevalidate ?? 0),
    })
    return true
  }

  private sweep(now: number) {
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
