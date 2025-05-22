import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ICache } from './ICache'

const PROMISE_TIMEOUT = 30

export class InMemoryCache implements ICache {
  private cache
  private inFlight = new Map<
    string,
    { promise: Promise<unknown>; timestamp: number }
  >()

  constructor(
    initialCache?: Map<string, { result: unknown; timestamp: number }>,
    private readonly enabled = env.NODE_ENV === 'production',
    private readonly promiseTimeout = PROMISE_TIMEOUT,
  ) {
    this.cache =
      initialCache ?? new Map<string, { result: unknown; timestamp: number }>()
  }

  async get<T>(
    options: { key: string[]; ttl: number },
    fallback: () => Promise<T>,
  ): Promise<T> {
    if (!this.enabled) {
      return fallback()
    }

    const key = this.getKey(options.key)
    const result = this.cache.get(key)

    if (result && result.timestamp + options.ttl > UnixTime.now()) {
      return result.result as T
    }

    const existingPromise = this.inFlight.get(key)
    if (
      existingPromise &&
      existingPromise.timestamp + this.promiseTimeout > UnixTime.now()
    ) {
      return existingPromise.promise as Promise<T>
    }

    const promise = fallback().finally(() => {
      this.inFlight.delete(key)
    })
    this.inFlight.set(key, { promise, timestamp: UnixTime.now() })

    const fallbackResult = await promise
    this.cache.set(key, {
      result: fallbackResult,
      timestamp: UnixTime.now(),
    })
    return fallbackResult
  }

  _get(key: string) {
    return this.cache.get(key)
  }

  _set(key: string, value: { result: unknown; timestamp: number }) {
    this.cache.set(key, value)
  }

  private getKey(key: string[]) {
    return key.join('-')
  }
}
