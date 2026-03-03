import { expect } from 'earl'

import { UpsertMap } from './UpsertMap'

describe(UpsertMap.name, () => {
  describe(UpsertMap.prototype.getOrInsert.name, () => {
    it('returns existing value when key exists', () => {
      const map = new UpsertMap<string, number>()
      map.set('foo', 42)

      const result = map.getOrInsert('foo', 100)

      expect(result).toEqual(42)
      expect(map.get('foo')).toEqual(42)
      expect(map.size).toEqual(1)
    })

    it('inserts and returns default value when key does not exist', () => {
      const map = new UpsertMap<string, number>()

      const result = map.getOrInsert('foo', 100)

      expect(result).toEqual(100)
      expect(map.get('foo')).toEqual(100)
      expect(map.size).toEqual(1)
    })

    it('works with complex value types', () => {
      const map = new UpsertMap<string, { count: number }>()
      const defaultValue = { count: 0 }

      const result = map.getOrInsert('foo', defaultValue)

      expect(result).toEqual(defaultValue)
      expect(map.get('foo')).toEqual({ count: 0 })
    })

    it('handles multiple keys', () => {
      const map = new UpsertMap<string, number>()

      map.getOrInsert('a', 1)
      map.getOrInsert('b', 2)
      map.getOrInsert('a', 100) // Should not update

      expect(map.get('a')).toEqual(1)
      expect(map.get('b')).toEqual(2)
      expect(map.size).toEqual(2)
    })
  })

  describe(UpsertMap.prototype.getOrInsertComputed.name, () => {
    it('returns existing value when key exists', () => {
      const map = new UpsertMap<string, number>()
      map.set('foo', 42)
      const callback = () => {
        throw new Error('Should not be called')
      }

      const result = map.getOrInsertComputed('foo', callback)

      expect(result).toEqual(42)
      expect(map.get('foo')).toEqual(42)
      expect(map.size).toEqual(1)
    })

    it('computes and inserts value when key does not exist', () => {
      const map = new UpsertMap<string, number>()
      const callback = (key: string) => key.length * 10

      const result = map.getOrInsertComputed('foo', callback)

      expect(result).toEqual(30)
      expect(map.get('foo')).toEqual(30)
      expect(map.size).toEqual(1)
    })

    it('passes key to callback function', () => {
      const map = new UpsertMap<string, string>()
      const callback = (key: string) => `value-${key}`

      const result = map.getOrInsertComputed('test', callback)

      expect(result).toEqual('value-test')
      expect(map.get('test')).toEqual('value-test')
    })

    it('only calls callback when key does not exist', () => {
      const map = new UpsertMap<string, number>()
      let callCount = 0
      const callback = () => {
        callCount++
        return 100
      }

      map.getOrInsertComputed('foo', callback)
      map.getOrInsertComputed('foo', callback)
      map.getOrInsertComputed('foo', callback)

      expect(callCount).toEqual(1)
      expect(map.size).toEqual(1)
    })

    it('works with complex computed values', () => {
      const map = new UpsertMap<string, { items: string[] }>()
      const callback = (key: string) => ({ items: [key] })

      const result = map.getOrInsertComputed('foo', callback)

      expect(result).toEqual({ items: ['foo'] })
      expect(map.get('foo')).toEqual({ items: ['foo'] })
    })

    it('handles multiple keys with different computed values', () => {
      const map = new UpsertMap<string, number>()
      const callback = (key: string) => key.length

      map.getOrInsertComputed('a', callback)
      map.getOrInsertComputed('bb', callback)
      map.getOrInsertComputed('ccc', callback)

      expect(map.get('a')).toEqual(1)
      expect(map.get('bb')).toEqual(2)
      expect(map.get('ccc')).toEqual(3)
      expect(map.size).toEqual(3)
    })
  })

  it('extends Map and inherits all Map methods', () => {
    const map = new UpsertMap<string, number>()

    map.set('a', 1)
    map.set('b', 2)

    expect(map.has('a')).toEqual(true)
    expect(map.get('a')).toEqual(1)
    expect(map.size).toEqual(2)

    map.delete('a')
    expect(map.has('a')).toEqual(false)
    expect(map.size).toEqual(1)

    map.clear()
    expect(map.size).toEqual(0)
  })

  it('can be iterated like a regular Map', () => {
    const map = new UpsertMap<string, number>()
    map.set('a', 1)
    map.set('b', 2)

    const entries = Array.from(map.entries())
    expect(entries).toEqual([
      ['a', 1],
      ['b', 2],
    ])
  })
})
