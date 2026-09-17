import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UnixTime } from '../types/UnixTime.js'
import { InMemoryCache } from './InMemoryCache.js'

describe(InMemoryCache.name, () => {
  describe(InMemoryCache.prototype.get.name, () => {
    it('should return cached value if it is not expired', async () => {
      const now = UnixTime.now()
      const cache = new InMemoryCache({})
      cache._set(['key'], { result: 'test', timestamp: now })
      const fallback = vi.fn().mockResolvedValue('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).not.toHaveBeenCalled()
      expect(cache._get(['key'])).toEqual({ result: 'test', timestamp: now })
      expect(result).toBe('test')
    })

    it('should return value from fallback if it is expired', async () => {
      const now = UnixTime.now()
      const cache = new InMemoryCache({})
      cache._set(['key'], { result: 'test', timestamp: now - 10000 })
      const fallback = vi.fn().mockResolvedValue('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).toHaveBeenCalled()
      expect(cache._get(['key'])).toEqual({
        result: 'test2',
        timestamp: now,
        maxLifetime: 1000,
      })
      expect(result).toBe('test2')
    })

    it('should not run fallback three times if three getData calls are ongoing', async () => {
      const cache = new InMemoryCache({})
      const fallback = vi.fn().mockResolvedValue('test2')

      const [res1, res2, res3] = await Promise.all([
        cache.get({ key: ['key'], ttl: 1000 }, fallback),
        cache.get({ key: ['key'], ttl: 1000 }, fallback),
        cache.get({ key: ['key'], ttl: 1000 }, fallback),
      ])

      expect(fallback).toHaveBeenCalledTimes(1)
      expect(res1).toBe('test2')
      expect(res2).toBe('test2')
      expect(res3).toBe('test2')
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

      expect(result1).toBe('test1')
      expect(result2).toBe('test2')
    })

    it('should not overwrite cache when superseded fallback resolves last', async () => {
      const cache = new InMemoryCache({ promiseTimeout: 0 })
      const cacheOptions = { key: ['key'], ttl: 1000 }
      const first = deferred<string>()
      const second = deferred<string>()

      const firstRequest = cache.get(cacheOptions, () => first.promise)
      const secondRequest = cache.get(cacheOptions, () => second.promise)

      second.resolve('new')
      expect(await secondRequest).toBe('new')

      first.resolve('old')
      expect(await firstRequest).toBe('old')

      const fallback = vi.fn().mockResolvedValue('unexpected')
      const result = await cache.get(cacheOptions, fallback)

      expect(result).toBe('new')
      expect(fallback).not.toHaveBeenCalled()
    })

    describe('stale-while-revalidate', () => {
      it('should serve stale data and revalidate in background', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
        const fallback = vi.fn().mockResolvedValue('fresh')

        // First call should return stale data and trigger revalidation
        const result1 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result1).toBe('stale')
        expect(fallback).toHaveBeenCalledTimes(1)

        // Wait for background revalidation to complete
        await new Promise((resolve) => setTimeout(resolve, 10))

        // Second call should return fresh data
        const result2 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result2).toBe('fresh')
        expect(fallback).toHaveBeenCalledTimes(1) // Still only called once
      })

      it('should not serve stale data if beyond stale-while-revalidate window', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 7000 })
        const fallback = vi.fn().mockResolvedValue('fresh')

        const result = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result).toBe('fresh')
        expect(fallback).toHaveBeenCalledTimes(1)
      })

      it('should handle multiple concurrent requests with stale data', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
        const fallback = vi.fn().mockResolvedValue('fresh')

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

        expect(result1).toBe('stale')
        expect(result2).toBe('stale')
        expect(result3).toBe('stale')
        expect(fallback).toHaveBeenCalledTimes(1)

        // Wait for background revalidation
        await new Promise((resolve) => setTimeout(resolve, 10))

        // Next request should get fresh data
        const result4 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result4).toBe('fresh')
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

        expect(cache._get(['expired1'])).not.toBe(undefined)
        expect(cache._get(['expired2'])).not.toBe(undefined)

        // Trigger a get — sweep should remove expired entries
        await cache.get({ key: ['other'], ttl: 1000 }, async () => 'result')

        expect(cache._get(['fresh'])).not.toBe(undefined)
        expect(cache._get(['expired1'])).toBe(undefined)
        expect(cache._get(['expired2'])).toBe(undefined)
        expect(cache._get(['no-lifetime'])).not.toBe(undefined)
      })

      it('should handle failed background revalidation gracefully', async () => {
        const now = UnixTime.now()
        const logger = {
          info: vi.fn().mockReturnValue(undefined),
          warn: vi.fn().mockReturnValue(undefined),
          debug: vi.fn().mockReturnValue(undefined),
          for: () => undefined as never,
        }
        const cache = new InMemoryCache({ logger })
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
        const fallback = vi
          .fn()
          .mockRejectedValue(new Error('Revalidation failed'))

        // First call should return stale data and trigger revalidation
        const result1 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result1).toBe('stale')
        expect(fallback).toHaveBeenCalledTimes(1)

        // Wait for background revalidation to fail
        await new Promise((resolve) => setTimeout(resolve, 10))

        expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
          'Cache revalidation failed',
          expect.objectContaining({
            key: '3:key',
            error: expect.objectContaining({ message: 'Revalidation failed' }),
          }),
        )

        // Next request should still get stale data since revalidation failed
        const result2 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result2).toBe('stale')
        expect(fallback).toHaveBeenCalledTimes(2)
      })

      it('should not overwrite cache when superseded revalidation resolves last', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({ promiseTimeout: 0 })
        cache._set(['key'], { result: 'stale', timestamp: now - 2 })
        const cacheOptions = {
          key: ['key'],
          ttl: 1,
          staleWhileRevalidate: 100,
        }
        const first = deferred<string>()
        const second = deferred<string>()

        expect(await cache.get(cacheOptions, () => first.promise)).toBe('stale')
        expect(await cache.get(cacheOptions, () => second.promise)).toBe(
          'stale',
        )

        second.resolve('new')
        await new Promise((resolve) => setTimeout(resolve, 0))
        first.resolve('old')
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(cache._get(['key'])?.result).toBe('new')
      })

      it('should keep stale data when revalidation resolves to undefined', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        cache._set(['key'], { result: 'stale', timestamp: now - 2000 })
        const fallback = vi.fn().mockResolvedValue(undefined)

        const result1 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result1).toBe('stale')
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

        expect(bogus).toBe('BOGUS')
        expect(real).toBe('REAL')
      })

      it('should reject a key part that is not a string', async () => {
        const cache = new InMemoryCache({})
        // Express hands an array to `?tab[]=a&tab[]=b`, which the declared
        // type forbids but cannot prevent.
        const tampered = ['a', 'b'] as unknown as string

        const result = cache.get(
          { key: ['layer2s', tampered], ttl: 1000 },
          async () => 'x',
        )
        await expect(result).rejects.toThrow(TypeError)
        await expect(result).rejects.toThrow('Cache key part is a object')
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

        expect(absent).toBe('ABSENT')
        expect(empty).toBe('EMPTY')
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

        expect(parent).toBe('PARENT')
        expect(child).toBe('CHILD')
      })
    })

    describe('nullish results', () => {
      it('should not cache undefined', async () => {
        const cache = new InMemoryCache({})
        const fallback = vi.fn().mockResolvedValue(undefined)

        const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

        expect(result).toBe(undefined)
        expect(cache._get(['key'])).toBe(undefined)

        await cache.get({ key: ['key'], ttl: 1000 }, fallback)
        expect(fallback).toHaveBeenCalledTimes(2)
      })

      it('should not cache null', async () => {
        const cache = new InMemoryCache({})
        const fallback = vi.fn().mockResolvedValue(null)

        await cache.get({ key: ['key'], ttl: 1000 }, fallback)

        expect(cache._get(['key'])).toBe(undefined)
      })

      it('should cache undefined when cacheNullish is set', async () => {
        const now = UnixTime.now()
        const cache = new InMemoryCache({})
        const fallback = vi.fn().mockResolvedValue(undefined)

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

        expect(cache._get(['zero'])?.result).toBe(0)
        expect(cache._get(['empty'])?.result).toBe('')
        expect(cache._get(['false'])?.result).toBe(false)
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
        expect(cache._get(['expired'])).not.toBe(undefined)

        fakeNow += 1
        await cache.get({ key: ['probe'], ttl: 1000 }, async () => 'probe')
        expect(cache._get(['expired'])).toBe(undefined)
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
        const fallback = vi.fn(() => {
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
        expect(await first).toBe('failed')
        await new Promise((resolve) => setTimeout(resolve, 5))

        const third = cache.get({ key: ['key'], ttl: 1000 }, fallback)
        expect(fallback).toHaveBeenCalledTimes(2)

        controls[1]?.resolve('second')
        expect(await second).toBe('second')
        expect(await third).toBe('second')
      })

      it('should not let a superseded fallback clear a newer in-flight one', async () => {
        const cache = new InMemoryCache({ promiseTimeout: 30 })
        const cacheOptions = { key: ['key'], ttl: 1000 }
        const first = deferred<string>()
        const second = deferred<string>()

        const firstRequest = cache.get(cacheOptions, () => first.promise)
        fakeNow += 31
        const secondRequest = cache.get(cacheOptions, () => second.promise)

        first.resolve('old')
        expect(await firstRequest).toBe('old')

        cache._set(['key'], { result: 'expired', timestamp: fakeNow - 2000 })
        const fallback = vi.fn().mockResolvedValue('unexpected')
        const thirdRequest = cache.get(cacheOptions, fallback)
        expect(fallback).not.toHaveBeenCalled()

        second.resolve('new')
        expect(await secondRequest).toBe('new')
        expect(await thirdRequest).toBe('new')
      })

      it('should store a superseded result when the newer fallback failed', async () => {
        const cache = new InMemoryCache({ promiseTimeout: 30 })
        const cacheOptions = { key: ['key'], ttl: 1000 }
        const first = deferred<string>()

        const firstRequest = cache.get(cacheOptions, () => first.promise)
        fakeNow += 31
        const secondRequest = cache
          .get(cacheOptions, () => Promise.reject(new Error('failed')))
          .catch(() => 'failed')
        expect(await secondRequest).toBe('failed')

        fakeNow += 5
        first.resolve('old')
        expect(await firstRequest).toBe('old')

        expect(cache._get(['key'])).toEqual({
          result: 'old',
          timestamp: fakeNow,
          maxLifetime: 1000,
        })
      })

      it('should not let a superseded fallback overwrite a newer result', async () => {
        const cache = new InMemoryCache({ promiseTimeout: 30 })
        const cacheOptions = { key: ['key'], ttl: 1000 }
        const first = deferred<string>()

        const firstRequest = cache.get(cacheOptions, () => first.promise)
        fakeNow += 31
        expect(await cache.get(cacheOptions, async () => 'new')).toBe('new')
        const storedAt = fakeNow

        fakeNow += 5
        first.resolve('old')
        expect(await firstRequest).toBe('old')

        expect(cache._get(['key'])).toEqual({
          result: 'new',
          timestamp: storedAt,
          maxLifetime: 1000,
        })
      })

      it('should not let a superseded revalidation clear a newer in-flight one', async () => {
        const cache = new InMemoryCache({ promiseTimeout: 30 })
        cache._set(['key'], { result: 'stale', timestamp: fakeNow - 2 })
        const cacheOptions = {
          key: ['key'],
          ttl: 1,
          staleWhileRevalidate: 100,
        }
        const first = deferred<string>()
        const second = deferred<string>()

        await cache.get(cacheOptions, () => first.promise)
        fakeNow += 31
        await cache.get(cacheOptions, () => second.promise)

        first.resolve('old')
        await new Promise((resolve) => setTimeout(resolve, 0))

        cache._set(['key'], { result: 'stale', timestamp: fakeNow - 2 })
        const fallback = vi.fn().mockResolvedValue('unexpected')
        await cache.get(cacheOptions, fallback)
        expect(fallback).not.toHaveBeenCalled()

        second.resolve('new')
        await new Promise((resolve) => setTimeout(resolve, 0))
        expect(cache._get(['key'])?.result).toBe('new')
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
