import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { env } from '~/env'
import { InMemoryCache } from './InMemoryCache'

describe(InMemoryCache.name, () => {
  let DEPLOYMENT_ENV: 'preview' | 'production' | undefined

  before(() => {
    DEPLOYMENT_ENV = env.DEPLOYMENT_ENV
    env.DEPLOYMENT_ENV = 'production'
  })

  after(() => {
    env.DEPLOYMENT_ENV = DEPLOYMENT_ENV
  })

  describe(InMemoryCache.prototype.get.name, () => {
    it('should return cached value if it is not expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now }],
      ])
      const cache = new InMemoryCache(initialCache)
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
      const cache = new InMemoryCache(initialCache)
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: ['key'], ttl: 1000 }, fallback)

      expect(fallback).toHaveBeenCalled()
      expect(cache._get('key')).toEqual({ result: 'test2', timestamp: now })
      expect(result).toEqual('test2')
    })

    it('should not run fallback three times if three getData calls are ongoing', async () => {
      const cache = new InMemoryCache()
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
      const cache = new InMemoryCache(undefined, 0)
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
        const initialCache = new Map([
          ['key', { result: 'stale', timestamp: now - 2000 }],
        ])
        const cache = new InMemoryCache(initialCache)
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
        const cache = new InMemoryCache(initialCache)
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
        const cache = new InMemoryCache(initialCache)
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

      it('should handle failed background revalidation gracefully', async () => {
        const now = UnixTime.now()
        const initialCache = new Map([
          ['key', { result: 'stale', timestamp: now - 2000 }],
        ])
        const cache = new InMemoryCache(initialCache)
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

        // Next request should still get stale data since revalidation failed
        const result2 = await cache.get(
          { key: ['key'], ttl: 1000, staleWhileRevalidate: 5000 },
          fallback,
        )

        expect(result2).toEqual('stale')
        expect(fallback).toHaveBeenCalledTimes(2)
      })
    })
  })
})
