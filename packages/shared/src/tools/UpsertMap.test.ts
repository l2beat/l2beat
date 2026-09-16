import { describe, expect, it } from 'vitest'

import { UpsertMap } from './UpsertMap'

describe(UpsertMap.name, () => {
  describe(UpsertMap.prototype.getOrInsert.name, () => {
    it('returns existing value when key exists', () => {
      const map = new UpsertMap<string, number>()
      map.set('foo', 42)

      const result = map.getOrInsert('foo', 100)

      expect(result).toStrictEqual(42)
      expect(map.get('foo')).toStrictEqual(42)
      expect(map.size).toStrictEqual(1)
    })

    it('inserts and returns default value when key does not exist', () => {
      const map = new UpsertMap<string, number>()

      const result = map.getOrInsert('foo', 100)

      expect(result).toStrictEqual(100)
      expect(map.get('foo')).toStrictEqual(100)
      expect(map.size).toStrictEqual(1)
    })

    it('works with complex value types', () => {
      const map = new UpsertMap<string, { count: number }>()
      const defaultValue = { count: 0 }

      const result = map.getOrInsert('foo', defaultValue)

      expect(result).toStrictEqual(defaultValue)
      expect(map.get('foo')).toStrictEqual({ count: 0 })
    })

    it('handles multiple keys', () => {
      const map = new UpsertMap<string, number>()

      map.getOrInsert('a', 1)
      map.getOrInsert('b', 2)
      map.getOrInsert('a', 100) // Should not update

      expect(map.get('a')).toStrictEqual(1)
      expect(map.get('b')).toStrictEqual(2)
      expect(map.size).toStrictEqual(2)
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

      expect(result).toStrictEqual(42)
      expect(map.get('foo')).toStrictEqual(42)
      expect(map.size).toStrictEqual(1)
    })

    it('computes and inserts value when key does not exist', () => {
      const map = new UpsertMap<string, number>()
      const callback = (key: string) => key.length * 10

      const result = map.getOrInsertComputed('foo', callback)

      expect(result).toStrictEqual(30)
      expect(map.get('foo')).toStrictEqual(30)
      expect(map.size).toStrictEqual(1)
    })

    it('passes key to callback function', () => {
      const map = new UpsertMap<string, string>()
      const callback = (key: string) => `value-${key}`

      const result = map.getOrInsertComputed('test', callback)

      expect(result).toStrictEqual('value-test')
      expect(map.get('test')).toStrictEqual('value-test')
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

      expect(callCount).toStrictEqual(1)
      expect(map.size).toStrictEqual(1)
    })

    it('works with complex computed values', () => {
      const map = new UpsertMap<string, { items: string[] }>()
      const callback = (key: string) => ({ items: [key] })

      const result = map.getOrInsertComputed('foo', callback)

      expect(result).toStrictEqual({ items: ['foo'] })
      expect(map.get('foo')).toStrictEqual({ items: ['foo'] })
    })

    it('handles multiple keys with different computed values', () => {
      const map = new UpsertMap<string, number>()
      const callback = (key: string) => key.length

      map.getOrInsertComputed('a', callback)
      map.getOrInsertComputed('bb', callback)
      map.getOrInsertComputed('ccc', callback)

      expect(map.get('a')).toStrictEqual(1)
      expect(map.get('bb')).toStrictEqual(2)
      expect(map.get('ccc')).toStrictEqual(3)
      expect(map.size).toStrictEqual(3)
    })
  })

  it('extends Map and inherits all Map methods', () => {
    const map = new UpsertMap<string, number>()

    map.set('a', 1)
    map.set('b', 2)

    expect(map.has('a')).toStrictEqual(true)
    expect(map.get('a')).toStrictEqual(1)
    expect(map.size).toStrictEqual(2)

    map.delete('a')
    expect(map.has('a')).toStrictEqual(false)
    expect(map.size).toStrictEqual(1)

    map.clear()
    expect(map.size).toStrictEqual(0)
  })

  it('can be iterated like a regular Map', () => {
    const map = new UpsertMap<string, number>()
    map.set('a', 1)
    map.set('b', 2)

    const entries = Array.from(map.entries())
    expect(entries).toStrictEqual([
      ['a', 1],
      ['b', 2],
    ])
  })
})
