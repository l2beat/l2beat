import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ICache } from './ICache'

const PROMISE_TIMEOUT = 30

interface Options {
  key: (string | undefined)[]
  ttl: number
  staleWhileRevalidate?: number
}

export class InMemoryCache implements ICache {
  private cache
  private inFlight = new Map<
    string,
    { promise: Promise<unknown>; timestamp: number }
  >()

  constructor(
    initialCache?: Map<string, { result: unknown; timestamp: number }>,
    private readonly promiseTimeout = PROMISE_TIMEOUT,
  ) {
    this.cache =
      initialCache ?? new Map<string, { result: unknown; timestamp: number }>()
  }

  async get<T>(options: Options, fallback: () => Promise<T>): Promise<T> {
    if (env.DEPLOYMENT_ENV !== 'production' || env.DISABLE_CACHE) {
      return fallback()
    }

    const key = this.getKey(options.key)
    const result = this.cache.get(key)
    const now = UnixTime.now()

    // If we have a result and it's not expired, return it immediately
    if (result && result.timestamp + options.ttl > now) {
      return result.result as T
    }

    // If we have stale data and staleWhileRevalidate is enabled
    if (
      result &&
      options.staleWhileRevalidate &&
      result.timestamp + options.ttl + options.staleWhileRevalidate > now
    ) {
      void this.revalidateInBackground(key, fallback)
      return result.result as T
    }

    // If no valid data exists, wait for fresh data
    const existingPromise = this.inFlight.get(key)
    if (
      existingPromise &&
      existingPromise.timestamp + this.promiseTimeout > now
    ) {
      return existingPromise.promise as Promise<T>
    }

    const promise = fallback().finally(() => {
      this.inFlight.delete(key)
    })
    this.inFlight.set(key, { promise, timestamp: now })

    const fallbackResult = await promise
    this.cache.set(key, {
      result: fallbackResult,
      timestamp: now,
    })
    return fallbackResult
  }

  private async revalidateInBackground<T>(
    key: string,
    fallback: () => Promise<T>,
  ): Promise<void> {
    console.log('inside revalidateInBackground', key)
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
    console.log('inside revalidateInBackground', key)

    try {
      const result = await promise
      this.cache.set(key, {
        result,
        timestamp: UnixTime.now(),
      })
    } catch (error) {
      // If revalidation fails, we keep the stale data
      console.error('Background revalidation failed:', error)
    }
    console.log('inside revalidateInBackground', key)
  }

  _get(key: string) {
    return this.cache.get(key)
  }

  _set(key: string, value: { result: unknown; timestamp: number }) {
    this.cache.set(key, value)
  }

  private getKey(key: (string | undefined)[]) {
    return key.filter(Boolean).join('-')
  }
}
