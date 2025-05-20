import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { InMemoryCache } from './InMemoryCache'

describe(InMemoryCache.name, () => {
  describe('getData', () => {
    it('it should return cached value if it is not expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now }],
      ])
      const cache = new InMemoryCache(initialCache)
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: 'key', ttl: 1000 }, fallback)

      expect(fallback).not.toHaveBeenCalled()
      expect(cache._get('key')).toEqual({ result: 'test', timestamp: now })
      expect(result).toEqual('test')
    })

    it('it should return value from fallback if it is expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now - 10000 }],
      ])
      const cache = new InMemoryCache(initialCache)
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.get({ key: 'key', ttl: 1000 }, fallback)

      expect(fallback).toHaveBeenCalled()
      expect(cache._get('key')).toEqual({ result: 'test2', timestamp: now })
      expect(result).toEqual('test2')
    })

    it('should not run fallback three times if three getData calls are ongoing', async () => {
      const cache = new InMemoryCache()
      const fallback = mockFn().resolvesTo('test2')

      const [res1, res2, res3] = await Promise.all([
        cache.get({ key: 'key', ttl: 1000 }, fallback),
        cache.get({ key: 'key', ttl: 1000 }, fallback),
        cache.get({ key: 'key', ttl: 1000 }, fallback),
      ])

      expect(fallback).toHaveBeenCalledTimes(1)
      expect(res1).toEqual('test2')
      expect(res2).toEqual('test2')
      expect(res3).toEqual('test2')
    })

    it('should timeout if fallback takes too long', async () => {
      const cache = new InMemoryCache(undefined, 0)
      const cacheOptions = { key: 'key', ttl: 1000 }
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
  })
})
