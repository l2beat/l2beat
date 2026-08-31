import { expect, mockFn } from 'earl'
import { UnixTime } from '../types/UnixTime.js'
import { InMemoryCache } from './InMemoryCache.js'

describe(InMemoryCache.name, () => {
  describe(InMemoryCache.prototype.get.name, () => {
    it('should return cached value if it is not expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now }],
      ])
      const cache = new InMemoryCache({
        initialCache,
      })
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).not.toHaveBeenCalled()
      expect(cache._get('key')).toEqual({ result: 'test', timestamp: now })
      expect(result).toEqual('test')
    })

    it('should return value from fallback if it is expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now - 10000 }],
      ])
      const cache = new InMemoryCache({ initialCache })
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).toHaveBeenCalled()
      expect(cache._get('key')).toEqual({
        result: 'test2',
        timestamp: now,
        maxLifetime: 1000,
      })
      expect(result).toEqual('test2')
    })

    it('should not run fallback three times if three getData calls are ongoing', async () => {
      const cache = new InMemoryCache({})
      const fallback = mockFn().resolvesTo('test2')

      const [res1, res2, res3] = await Promise.all([
        cache.get({ key: ['key'], ttl: 1000 }, fallback),
        cache.get({ key: ['key'], ttl: 1000 }, fallback),
        cache.get({ key: ['key'], ttl: 1000 }, fallback),
      ])

      expect(fallback).toHaveBeenCalledTimes(1)
      expect(res1).toEqual('test2')
      expect(res2).toEqual('test2')
      expect(res3).toEqual('test2')
    })

    it('should timeout if fallback takes too long', async () => {
      const cache = new InMemoryCache({
        promiseTimeout: 0,
      })
      const cacheOptions = { key: ['key'], ttl: 1000 }
      const fallback1 = () =>
        new Promise((resolve) => setTimeout(() => resolve('test1'), 10))
      const fallback2 = () => new Promise((resolve) => resolve('test2'))

      const [result1, result2] = await Promise.all([
        cache.get(cacheOptions, fallback1),
        cache.get(cacheOptions, fallback2),
      ])

      expect(result1).toEqual('test1')
      expect(result2).toEqual('test2')
    })

    it('should not overwrite cache when superseded fallback resolves last', async () => {
      const cache = new InMemoryCache({ promiseTimeout: 0 })
      const cacheOptions = { key: ['key'], ttl: 1000 }
      const first = deferred<string>()
      const second = deferred<string>()

      const firstRequest = cache.get(cacheOptions, () => first.promise)
      const secondRequest = cache.get(cacheOptions, () => second.promise)

      second.resolve('new')
      expect(await secondRequest).toEqual('new')

      first.resolve('old')
      expect(await firstRequest).toEqual('old')

      const fallback = mockFn().resolvesTo('unexpected')
      const result = await cache.get(cacheOptions, fallback)

      expect(result).toEqual('new')
      expect(fallback).not.toHaveBeenCalled()
    })

    it('should not clear newer in-flight fallback when superseded fallback resolves', async () => {
      const originalNow = Date.now
      let now = originalNow()
      Date.now = () => now

      try {
        const cache = new InMemoryCache({ promiseTimeout: 30 })
        const cacheOptions = { key: ['key'], ttl: 1000 }
        const first = deferred<string>()
        const second = deferred<string>()

        const firstRequest = cache.get(cacheOptions, () => first.promise)
        now += 31_000
        const secondRequest = cache.get(cacheOptions, () => second.promise)

        first.resolve('old')
        expect(await firstRequest).toEqual('old')

        cache._set('key', {
          result: 'expired',
          timestamp: UnixTime.now() - 2000,
        })
        const fallback = mockFn().resolvesTo('unexpected')
        const thirdRequest = cache.get(cacheOptions, fallback)
        expect(fallback).not.toHaveBeenCalled()

        second.resolve('new')
        expect(await secondRequest).toEqual('new')
        expect(await thirdRequest).toEqual('new')
      } finally {
        Date.now = originalNow
      }
    })

    describe('stale-while-revalidate', () => {
      it('should serve stale data and revalidate in background', async () => {
        const now = UnixTime.now()
        const initialCache = new Map([
          ['key', { result: 'stale', timestamp: now - 2000 }],
        ])
        const cache = new InMemoryCache({ initialCache })
        const fallback = mockFn().resolvesTo('fresh')

        // First call should return stale data and trigger revalidation
        const result1 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result1).toEqual('stale')
        expect(fallback).toHaveBeenCalledTimes(1)

        // Wait for background revalidation to complete
        await new Promise((resolve) => setTimeout(resolve, 10))

        // Second call should return fresh data
        const result2 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result2).toEqual('fresh')
        expect(fallback).toHaveBeenCalledTimes(1) // Still only called once
      })

      it('should not serve stale data if beyond stale-while-revalidate window', async () => {
        const now = UnixTime.now()
        const initialCache = new Map([
          ['key', { result: 'stale', timestamp: now - 7000 }],
        ])
        const cache = new InMemoryCache({ initialCache })
        const fallback = mockFn().resolvesTo('fresh')

        const result = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result).toEqual('fresh')
        expect(fallback).toHaveBeenCalledTimes(1)
      })

      it('should handle multiple concurrent requests with stale data', async () => {
        const now = UnixTime.now()
        const initialCache = new Map([
          ['key', { result: 'stale', timestamp: now - 2000 }],
        ])
        const cache = new InMemoryCache({ initialCache })
        const fallback = mockFn().resolvesTo('fresh')

        const [result1, result2, result3] = await Promise.all([
          cache.get(
            { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
            fallback,
          ),
          cache.get(
            { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
            fallback,
          ),
          cache.get(
            { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
            fallback,
          ),
        ])

        expect(result1).toEqual('stale')
        expect(result2).toEqual('stale')
        expect(result3).toEqual('stale')
        expect(fallback).toHaveBeenCalledTimes(1)

        // Wait for background revalidation
        await new Promise((resolve) => setTimeout(resolve, 10))

        // Next request should get fresh data
        const result4 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result4).toEqual('fresh')
        expect(fallback).toHaveBeenCalledTimes(1)
      })

      it('should sweep expired entries on get to free memory', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})

        // Populate cache with entries that have known maxLifetime
        cache._set('fresh', {
          result: 'fresh',
          timestamp: now,
          maxLifetime: 1000,
        })
        cache._set('expired1', {
          result: 'old1',
          timestamp: now - 10000,
          maxLifetime: 1000,
        })
        cache._set('expired2', {
          result: 'old2',
          timestamp: now - 20000,
          maxLifetime: 5000,
        })
        cache._set('no-lifetime', {
          result: 'permanent',
          timestamp: now - 99999,
        })

        expect(cache._get('expired1')).not.toEqual(undefined)
        expect(cache._get('expired2')).not.toEqual(undefined)

        // Trigger a get — sweep should remove expired entries
        await cache.get({ key: ['other'], ttl: 1000 }, async () => 'result')

        expect(cache._get('fresh')).not.toEqual(undefined)
        expect(cache._get('expired1')).toEqual(undefined)
        expect(cache._get('expired2')).toEqual(undefined)
        expect(cache._get('no-lifetime')).not.toEqual(undefined)
      })

      it('should handle failed background revalidation gracefully', async () => {
        const now = UnixTime.now()
        const initialCache = new Map([
          ['key', { result: 'stale', timestamp: now - 2000 }],
        ])
        const logger = {
          info: mockFn().returns(undefined),
          warn: mockFn().returns(undefined),
          debug: mockFn().returns(undefined),
          for: () => undefined as never,
        }
        const cache = new InMemoryCache({ initialCache, logger })
        const fallback = mockFn().rejectsWith(new Error('Revalidation failed'))

        // First call should return stale data and trigger revalidation
        const result1 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result1).toEqual('stale')
        expect(fallback).toHaveBeenCalledTimes(1)

        // Wait for background revalidation to fail
        await new Promise((resolve) => setTimeout(resolve, 10))

        expect(logger.warn).toHaveBeenCalledTimes(1)

        const [message, parameters] = logger.warn.calls[0]?.args ?? []
        expect(message).toEqual('Cache revalidation failed')
        expect((parameters as { key: string }).key).toEqual('key')
        expect((parameters as { error: Error }).error.message).toEqual(
          'Revalidation failed',
        )

        // Next request should still get stale data since revalidation failed
        const result2 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result2).toEqual('stale')
        expect(fallback).toHaveBeenCalledTimes(2)
      })

      it('should not overwrite cache when superseded revalidation resolves last', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({
          initialCache: new Map([
            ['key', { result: 'stale', timestamp: now - 2 }],
          ]),
          promiseTimeout: 0,
        })
        const cacheOptions = {
          key: ['key'],
          ttl: 1,
          staleWhileRevalidate: 100,
        }
        const first = deferred<string>()
        const second = deferred<string>()

        expect(await cache.get(cacheOptions, () => first.promise)).toEqual(
          'stale',
        )
        expect(await cache.get(cacheOptions, () => second.promise)).toEqual(
          'stale',
        )

        second.resolve('new')
        await second.promise
        await Promise.resolve()
        first.resolve('old')
        await first.promise
        await Promise.resolve()

        expect(cache._get('key')?.result).toEqual('new')
      })

      it('should not clear newer in-flight revalidation when superseded revalidation resolves', async () => {
        const originalNow = Date.now
        let now = originalNow()
        Date.now = () => now

        try {
          const cache = new InMemoryCache({
            initialCache: new Map([
              ['key', { result: 'stale', timestamp: UnixTime.now() - 2 }],
            ]),
            promiseTimeout: 30,
          })
          const cacheOptions = {
            key: ['key'],
            ttl: 1,
            staleWhileRevalidate: 100,
          }
          const first = deferred<string>()
          const second = deferred<string>()

          await cache.get(cacheOptions, () => first.promise)
          now += 31_000
          await cache.get(cacheOptions, () => second.promise)

          first.resolve('old')
          await first.promise
          await Promise.resolve()

          cache._set('key', {
            result: 'stale',
            timestamp: UnixTime.now() - 2,
          })
          const fallback = mockFn().resolvesTo('unexpected')
          await cache.get(cacheOptions, fallback)
          expect(fallback).not.toHaveBeenCalled()

          second.resolve('new')
          await second.promise
        } finally {
          Date.now = originalNow
        }
      })
    })
  })
})

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })

  return { promise, resolve }
}
