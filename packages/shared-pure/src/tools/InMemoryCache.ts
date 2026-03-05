import { UnixTime } from '../types/UnixTime.js'

const PROMISE_TIMEOUT = 30

type Logger = {
  info: (...args: unknown[]) => void
  for: (object: object) => Logger
}

interface Config {
  logger?: Logger
  enabled?: boolean
  initialCache?: Map<
    string,
    {
      result: unknown
      timestamp: number
    }
  >
  promiseTimeout?: number
}

interface Options {
  key: (string | null | undefined)[]
  ttl: number
  staleWhileRevalidate?: number
}

export class InMemoryCache {
  private cache
  private enabled
  private promiseTimeout
  private logger
  private inFlight = new Map<
    string,
    { promise: Promise<unknown>; timestamp: number }
  >()

  constructor(config: Config) {
    this.logger = config.logger
    this.enabled = config?.enabled ?? true
    this.cache =
      config?.initialCache ??
      new Map<string, { result: unknown; timestamp: number }>()
    this.promiseTimeout = config?.promiseTimeout ?? PROMISE_TIMEOUT
  }

  async get<T>(options: Options, fallback: () => Promise<T>): Promise<T> {
    if (!this.enabled) {
      return fallback()
    }

    this.logger?.info('Getting cache key', { key: options.key })
    const key = this.getKey(options.key.filter(Boolean) as string[])
    const result = this.cache.get(key)
    const now = UnixTime.now()

    // If we have a result and it's not expired, return it immediately
    if (result && result.timestamp + options.ttl > now) {
      this.logger?.info('Cache hit', { key, result })
      return result.result as T
    }

    // If we have stale data and staleWhileRevalidate is enabled
    if (
      result &&
      options.staleWhileRevalidate &&
      result.timestamp + options.ttl + options.staleWhileRevalidate > now
    ) {
      this.logger?.info('Cache stale', { key })
      void this.revalidateInBackground(key, fallback)
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

    const promise = fallback().finally(() => {
      this.inFlight.delete(key)
    })
    this.inFlight.set(key, { promise, timestamp: now })

    this.logger?.info('Cache miss', { key })

    const start = Date.now()
    const fallbackResult = await promise
    const duration = Date.now() - start

    this.cache.set(key, {
      result: fallbackResult,
      timestamp: now,
    })
    this.logger?.info('Cache set', { key, duration })

    return fallbackResult
  }

  private async revalidateInBackground<T>(
    key: string,
    fallback: () => Promise<T>,
  ): Promise<void> {
    const existingPromise = this.inFlight.get(key)
    if (
      existingPromise &&
      existingPromise.timestamp + this.promiseTimeout > UnixTime.now()
    ) {
      return
    }

    const promise = fallback().finally(() => {
      this.inFlight.delete(key)
    })
    this.inFlight.set(key, { promise, timestamp: UnixTime.now() })

    try {
      const result = await promise
      this.cache.set(key, {
        result,
        timestamp: UnixTime.now(),
      })
    } catch {
      // If revalidation fails, we keep the stale data
    }
  }

  _get(key: string) {
    return this.cache.get(key)
  }

  _set(key: string, value: { result: unknown; timestamp: number }) {
    this.cache.set(key, value)
  }

  private getKey(key: (string | null | undefined)[]) {
    return key.filter(Boolean).join('-')
  }
}
