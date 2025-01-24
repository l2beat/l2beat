import { expect } from 'earl'
import { InMemoryCache } from './InMemoryCache'

describe('InMemoryCache', () => {
  let cache: InMemoryCache

  beforeEach(() => {
    cache = new InMemoryCache()
  })

  describe('set method', () => {
    it('should store a key-value pair', async () => {
      await cache.set('foo', 'bar')
      const value = await cache.get('foo')
      expect(value).toEqual('bar')
    })

    it('should overwrite an existing key', async () => {
      await cache.set('foo', 'bar')
      await cache.set('foo', 'baz')
      const value = await cache.get('foo')
      expect(value).toEqual('baz')
    })
  })

  describe('get method', () => {
    it('should retrieve the correct value for a given key', async () => {
      await cache.set('hello', 'world')
      const value = await cache.get('hello')
      expect(value).toEqual('world')
    })

    it('should return undefined for a non-existent key', async () => {
      const value = await cache.get('nonexistent')
      expect(value).toEqual(undefined)
    })
  })

  describe('concurrency', () => {
    it('should handle multiple set and get operations concurrently', async () => {
      const operations = []
      for (let i = 0; i < 100; i++) {
        operations.push(cache.set(`key${i}`, `value${i}`))
      }
      await Promise.all(operations)

      const retrievals = []
      for (let i = 0; i < 100; i++) {
        retrievals.push(cache.get(`key${i}`))
      }
      const results = await Promise.all(retrievals)

      for (let i = 0; i < 100; i++) {
        expect(results[i]).toEqual(`value${i}`)
      }
    })
  })
})
