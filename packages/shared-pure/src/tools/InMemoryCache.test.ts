import { expect, mockFn } from 'earl'
import { UnixTime } from '../types/UnixTime.js'
import { InMemoryCache } from './InMemoryCache.js'

describe(InMemoryCache.name, () => {
  describe(InMemoryCache.prototype.get.name, () => {
    it('should return cached value if it is not expired', async () => {
      const now = UnixTime.now()
      const cache = new InMemoryCache({})
      cache._set(['key'], { result: 'test', timestamp: now })
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).not.toHaveBeenCalled()
      expect(cache._get(['key'])).toEqual({ result: 'test', timestamp: now })
      expect(result).toEqual('test')
    })

    it('should return value from fallback if it is expired', async () => {
      const now = UnixTime.now()
      const cache = new InMemoryCache({})
      cache._set(['key'], { result: 'test', timestamp: now - 10000 })
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).toHaveBeenCalled()
      expect(cache._get(['key'])).toEqual({
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

    describe('stale-while-revalidate', () => {
      it('should serve stale data and revalidate in background', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
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
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 7000 })
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
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
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
        cache._set(['fresh'], {
          result: 'fresh',
          timestamp: now,
          maxLifetime: 1000,
        })
        cache._set(['expired1'], {
          result: 'old1',
          timestamp: now - 10000,
          maxLifetime: 1000,
        })
        cache._set(['expired2'], {
          result: 'old2',
          timestamp: now - 20000,
          maxLifetime: 5000,
        })
        cache._set(['no-lifetime'], {
          result: 'permanent',
          timestamp: now - 99999,
        })

        expect(cache._get(['expired1'])).not.toEqual(undefined)
        expect(cache._get(['expired2'])).not.toEqual(undefined)

        // Trigger a get — sweep should remove expired entries
        await cache.get({ key: ['other'], ttl: 1000 }, async () => 'result')

        expect(cache._get(['fresh'])).not.toEqual(undefined)
        expect(cache._get(['expired1'])).toEqual(undefined)
        expect(cache._get(['expired2'])).toEqual(undefined)
        expect(cache._get(['no-lifetime'])).not.toEqual(undefined)
      })

      it('should handle failed background revalidation gracefully', async () => {
        const now = UnixTime.now()
        const logger = {
          info: mockFn().returns(undefined),
          warn: mockFn().returns(undefined),
          debug: mockFn().returns(undefined),
          for: () => undefined as never,
        }
        const cache = new InMemoryCache({ logger })
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
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
        expect((parameters as { key: string }).key).toEqual('3:key')
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

      it('should keep stale data when revalidation resolves to undefined', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
        const fallback = mockFn().resolvesTo(undefined)

        const result1 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result1).toEqual('stale')
        await new Promise((resolve) => setTimeout(resolve, 10))

        expect(cache._get(['key'])).toEqual({
          result: 'stale',
          timestamp: now - 2000,
        })
      })
    })

    describe('key encoding', () => {
      it('should not let a key part collide with a longer key', async () => {
        const cache = new InMemoryCache({})
        const options = { ttl: 1000, staleWhileRevalidate: 5000 }

        const bogus = await cache.get(
          {
            ...options,
            key: ['layer2s', 'projects', 'arbitrum-tvs-breakdown'],
          },
          async () => 'BOGUS',
        )
        const real = await cache.get(
          {
            ...options,
            key: ['layer2s', 'projects', 'arbitrum', 'tvs-breakdown'],
          },
          async () => 'REAL',
        )

        expect(bogus).toEqual('BOGUS')
        expect(real).toEqual('REAL')
      })

      it('should reject a key part that is not a string', async () => {
        const cache = new InMemoryCache({})
        // Express hands an array to `?tab[]=a&tab[]=b`, which the declared
        // type forbids but cannot prevent.
        const tampered = ['a', 'b'] as unknown as string

        await expect(
          cache.get({ key: ['layer2s', tampered], ttl: 1000 }, async () => 'x'),
        ).toBeRejectedWith(TypeError, 'Cache key part is a object')
      })

      it('should tell an absent key part apart from an empty one', async () => {
        const cache = new InMemoryCache({})
        const options = { ttl: 1000 }

        const absent = await cache.get(
          { ...options, key: ['layer2s', undefined] },
          async () => 'ABSENT',
        )
        const empty = await cache.get(
          { ...options, key: ['layer2s', ''] },
          async () => 'EMPTY',
        )

        expect(absent).toEqual('ABSENT')
        expect(empty).toEqual('EMPTY')
      })

      it('should not let nullish key parts collapse onto the parent key', async () => {
        const cache = new InMemoryCache({})
        const options = { ttl: 1000 }

        const parent = await cache.get(
          { ...options, key: ['layer2s', 'tvs'] },
          async () => 'PARENT',
        )
        const child = await cache.get(
          { ...options, key: ['layer2s', 'tvs', undefined] },
          async () => 'CHILD',
        )

        expect(parent).toEqual('PARENT')
        expect(child).toEqual('CHILD')
      })
    })

    describe('nullish results', () => {
      it('should not cache undefined', async () => {
        const cache = new InMemoryCache({})
        const fallback = mockFn().resolvesTo(undefined)

        const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

        expect(result).toEqual(undefined)
        expect(cache._get(['key'])).toEqual(undefined)

        await cache.get({ key: ['key'], ttl: 1000 }, fallback)
        expect(fallback).toHaveBeenCalledTimes(2)
      })

      it('should not cache null', async () => {
        const cache = new InMemoryCache({})
        const fallback = mockFn().resolvesTo(null)

        await cache.get({ key: ['key'], ttl: 1000 }, fallback)

        expect(cache._get(['key'])).toEqual(undefined)
      })

      it('should cache undefined when cacheNullish is set', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        const fallback = mockFn().resolvesTo(undefined)

        await cache.get(
          { key: ['key'], ttl: 1000, cacheNullish: true },
          fallback,
        )

        expect(cache._get(['key'])).toEqual({
          result: undefined,
          timestamp: now,
          maxLifetime: 1000,
        })

        await cache.get(
          { key: ['key'], ttl: 1000, cacheNullish: true },
          fallback,
        )
        expect(fallback).toHaveBeenCalledTimes(1)
      })

      it('should still cache falsy values that are not nullish', async () => {
        const cache = new InMemoryCache({})

        await cache.get({ key: ['zero'], ttl: 1000 }, async () => 0)
        await cache.get({ key: ['empty'], ttl: 1000 }, async () => '')
        await cache.get({ key: ['false'], ttl: 1000 }, async () => false)

        expect(cache._get(['zero'])?.result).toEqual(0)
        expect(cache._get(['empty'])?.result).toEqual('')
        expect(cache._get(['false'])?.result).toEqual(false)
      })
    })

    describe('with a controlled clock', () => {
      const realNow = UnixTime.now
      let fakeNow = realNow()

      beforeEach(() => {
        fakeNow = realNow()
        UnixTime.now = () => fakeNow
      })

      afterEach(() => {
        UnixTime.now = realNow
      })

      it('should sweep at most once per second', async () => {
        const cache = new InMemoryCache({})

        await cache.get({ key: ['probe'], ttl: 1000 }, async () => 'probe')

        cache._set(['expired'], {
          result: 'old',
          timestamp: fakeNow - 10_000,
          maxLifetime: 1000,
        })
        await cache.get({ key: ['probe'], ttl: 1000 }, async () => 'probe')
        expect(cache._get(['expired'])).not.toEqual(undefined)

        fakeNow += 1
        await cache.get({ key: ['probe'], ttl: 1000 }, async () => 'probe')
        expect(cache._get(['expired'])).toEqual(undefined)
      })

      it('should timestamp an entry when the fallback returned', async () => {
        const cache = new InMemoryCache({})
        const started = fakeNow
        let resolveFallback = (_value: string) => {}

        const pending = cache.get({ key: ['key'], ttl: 1000 }, () => {
          return new Promise<string>((resolve) => {
            resolveFallback = resolve
          })
        })

        fakeNow += 10
        resolveFallback('slow')
        await pending

        expect(cache._get(['key'])).toEqual({
          result: 'slow',
          timestamp: started + 10,
          maxLifetime: 1000,
        })
      })

      it('should not let a superseded fallback clear the live one', async () => {
        const cache = new InMemoryCache({ promiseTimeout: 30 })
        const controls: {
          resolve: (value: string) => void
          reject: (error: Error) => void
        }[] = []
        const fallback = mockFn(() => {
          return new Promise<string>((resolve, reject) => {
            controls.push({ resolve, reject })
          })
        })

        const first = cache
          .get({ key: ['key'], ttl: 1000 }, fallback)
          .catch(() => 'failed')
        fakeNow += 31
        const second = cache.get({ key: ['key'], ttl: 1000 }, fallback)
        expect(fallback).toHaveBeenCalledTimes(2)

        controls[0]?.reject(new Error('too slow'))
        expect(await first).toEqual('failed')
        await new Promise((resolve) => setTimeout(resolve, 5))

        const third = cache.get({ key: ['key'], ttl: 1000 }, fallback)
        expect(fallback).toHaveBeenCalledTimes(2)

        controls[1]?.resolve('second')
        expect(await second).toEqual('second')
        expect(await third).toEqual('second')
      })
    })
  })
})
