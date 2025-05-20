import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { DataCache } from './DataCache'

describe(DataCache.name, () => {
  describe('getData', () => {
    it('it should return cached value if it is not expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now }],
      ])
      const cache = new DataCache(initialCache)
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.getData({ key: 'key', ttl: 1000 }, fallback)

      expect(fallback).not.toHaveBeenCalled()
      expect(cache._get('key')).toEqual({ result: 'test', timestamp: now })
      expect(result).toEqual('test')
    })

    it('it should return value from fallback if it is expired', async () => {
      const now = UnixTime.now()
      const initialCache = new Map([
        ['key', { result: 'test', timestamp: now - 10000 }],
      ])
      const cache = new DataCache(initialCache)
      const fallback = mockFn().resolvesTo('test2')

      const result = await cache.getData({ key: 'key', ttl: 1000 }, fallback)

      expect(fallback).toHaveBeenCalled()
      expect(cache._get('key')).toEqual({ result: 'test2', timestamp: now })
      expect(result).toEqual('test2')
    })

    it('should not run fallback three times if three getData calls are ongoing', async () => {
      const cache = new DataCache()
      const fallback = mockFn().resolvesTo('test2')

      const [res1, res2, res3] = await Promise.all([
        cache.getData({ key: 'key', ttl: 1000 }, fallback),
        cache.getData({ key: 'key', ttl: 1000 }, fallback),
        cache.getData({ key: 'key', ttl: 1000 }, fallback),
      ])

      expect(fallback).toHaveBeenCalledTimes(1)
      expect(res1).toEqual('test2')
      expect(res2).toEqual('test2')
      expect(res3).toEqual('test2')
    })
  })
})
