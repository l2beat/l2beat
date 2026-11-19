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
    it('should return undefined for a non-existent key', async () => {
      const value = await cache.get('nonexistent')
      expect(value).toEqual(undefined)
    })
  })
})
