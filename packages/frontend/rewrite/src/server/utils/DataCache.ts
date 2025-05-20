import { UnixTime } from '@l2beat/shared-pure'

// TODO: when two gets are ongoing do not run fallback twice
export class DataCache {
  private cache
  private inFlight = new Map<string, Promise<unknown>>()

  constructor(
    initialCache?: Map<string, { result: unknown; timestamp: number }>,
  ) {
    this.cache =
      initialCache ?? new Map<string, { result: unknown; timestamp: number }>()
  }

  async getData<T>(
    options: { key: string; ttl: number },
    fallback: () => Promise<T>,
  ): Promise<T> {
    const result = this.cache.get(options.key)

    if (result && result.timestamp + options.ttl > UnixTime.now()) {
      return result.result as T
    }

    const existingPromise = this.inFlight.get(options.key)
    if (existingPromise) {
      return existingPromise as Promise<T>
    }

    const promise = fallback().finally(() => {
      this.inFlight.delete(options.key)
    })
    this.inFlight.set(options.key, promise)

    const fallbackResult = await promise
    this.cache.set(options.key, {
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
}
