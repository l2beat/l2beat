import { expect } from 'earl'
import { InteropArgs } from './InteropArgs'

describe(InteropArgs.serialize.name, () => {
  it('serializes bigint values', () => {
    const result = InteropArgs.serialize(123n)
    expect(result).toEqual('BigInt(123)')
  })

  it('serializes large bigint values', () => {
    const result = InteropArgs.serialize(12345678901234567890n)
    expect(result).toEqual('BigInt(12345678901234567890)')
  })

  it('serializes negative bigint values', () => {
    const result = InteropArgs.serialize(-456n)
    expect(result).toEqual('BigInt(-456)')
  })

  it('serializes zero bigint', () => {
    const result = InteropArgs.serialize(0n)
    expect(result).toEqual('BigInt(0)')
  })

  it('passes through primitive values unchanged', () => {
    expect(InteropArgs.serialize('hello')).toEqual('hello')
    expect(InteropArgs.serialize(123)).toEqual(123)
    expect(InteropArgs.serialize(true)).toEqual(true)
    expect(InteropArgs.serialize(false)).toEqual(false)
    expect(InteropArgs.serialize(null)).toEqual(null)
    expect(InteropArgs.serialize(undefined)).toEqual(undefined)
  })

  it('serializes arrays with bigints', () => {
    const result = InteropArgs.serialize([1n, 2n, 3n])
    expect(result).toEqual(['BigInt(1)', 'BigInt(2)', 'BigInt(3)'])
  })

  it('serializes arrays with mixed types', () => {
    const result = InteropArgs.serialize([1n, 'text', 123, true, null])
    expect(result).toEqual(['BigInt(1)', 'text', 123, true, null])
  })

  it('serializes empty arrays', () => {
    const result = InteropArgs.serialize([])
    expect(result).toEqual([])
  })

  it('serializes objects with bigint values', () => {
    const result = InteropArgs.serialize({ a: 123n, b: 456n })
    expect(result).toEqual({ a: 'BigInt(123)', b: 'BigInt(456)' })
  })

  it('serializes objects with mixed types', () => {
    const result = InteropArgs.serialize({
      bigIntValue: 789n,
      stringValue: 'test',
      numberValue: 42,
      boolValue: true,
      nullValue: null,
    })
    expect(result).toEqual({
      bigIntValue: 'BigInt(789)',
      stringValue: 'test',
      numberValue: 42,
      boolValue: true,
      nullValue: null,
    })
  })

  it('serializes empty objects', () => {
    const result = InteropArgs.serialize({})
    expect(result).toEqual({})
  })

  it('serializes nested arrays', () => {
    const result = InteropArgs.serialize([
      [1n, 2n],
      [3n, 4n],
    ])
    expect(result).toEqual([
      ['BigInt(1)', 'BigInt(2)'],
      ['BigInt(3)', 'BigInt(4)'],
    ])
  })

  it('serializes nested objects', () => {
    const result = InteropArgs.serialize({
      outer: {
        inner: 123n,
      },
    })
    expect(result).toEqual({
      outer: {
        inner: 'BigInt(123)',
      },
    })
  })

  it('serializes arrays in objects', () => {
    const result = InteropArgs.serialize({
      values: [1n, 2n, 3n],
      name: 'test',
    })
    expect(result).toEqual({
      values: ['BigInt(1)', 'BigInt(2)', 'BigInt(3)'],
      name: 'test',
    })
  })

  it('serializes objects in arrays', () => {
    const result = InteropArgs.serialize([{ a: 1n }, { b: 2n }])
    expect(result).toEqual([{ a: 'BigInt(1)' }, { b: 'BigInt(2)' }])
  })

  it('serializes deeply nested structures', () => {
    const result = InteropArgs.serialize({
      level1: {
        level2: {
          level3: [
            {
              bigIntValue: 999n,
              array: [1n, 2n],
            },
          ],
        },
      },
    })
    expect(result).toEqual({
      level1: {
        level2: {
          level3: [
            {
              bigIntValue: 'BigInt(999)',
              array: ['BigInt(1)', 'BigInt(2)'],
            },
          ],
        },
      },
    })
  })
})

describe(InteropArgs.deserialize.name, () => {
  it('deserializes BigInt strings', () => {
    const result = InteropArgs.deserialize('BigInt(123)')
    expect(result).toEqual(123n)
  })

  it('deserializes large BigInt strings', () => {
    const result = InteropArgs.deserialize('BigInt(12345678901234567890)')
    expect(result).toEqual(12345678901234567890n)
  })

  it('deserializes negative BigInt strings', () => {
    const result = InteropArgs.deserialize('BigInt(-456)')
    expect(result).toEqual(-456n)
  })

  it('deserializes zero BigInt string', () => {
    const result = InteropArgs.deserialize('BigInt(0)')
    expect(result).toEqual(0n)
  })

  it('passes through primitive values unchanged', () => {
    expect(InteropArgs.deserialize('hello')).toEqual('hello')
    expect(InteropArgs.deserialize(123)).toEqual(123)
    expect(InteropArgs.deserialize(true)).toEqual(true)
    expect(InteropArgs.deserialize(false)).toEqual(false)
    expect(InteropArgs.deserialize(null)).toEqual(null)
    expect(InteropArgs.deserialize(undefined)).toEqual(undefined)
  })

  it('does not deserialize strings that only start with BigInt(', () => {
    const result = InteropArgs.deserialize('BigInt(123')
    expect(result).toEqual('BigInt(123')
  })

  it('does not deserialize strings that only end with )', () => {
    const result = InteropArgs.deserialize('123)')
    expect(result).toEqual('123)')
  })

  it('does not deserialize strings that contain BigInt( in the middle', () => {
    const result = InteropArgs.deserialize('prefix BigInt(123)')
    expect(result).toEqual('prefix BigInt(123)')
  })

  it('deserializes arrays with BigInt strings', () => {
    const result = InteropArgs.deserialize([
      'BigInt(1)',
      'BigInt(2)',
      'BigInt(3)',
    ])
    expect(result).toEqual([1n, 2n, 3n])
  })

  it('deserializes arrays with mixed types', () => {
    const result = InteropArgs.deserialize([
      'BigInt(1)',
      'text',
      123,
      true,
      null,
    ])
    expect(result).toEqual([1n, 'text', 123, true, null])
  })

  it('deserializes empty arrays', () => {
    const result = InteropArgs.deserialize([])
    expect(result).toEqual([])
  })

  it('deserializes objects with BigInt strings', () => {
    const result = InteropArgs.deserialize({
      a: 'BigInt(123)',
      b: 'BigInt(456)',
    })
    expect(result).toEqual({ a: 123n, b: 456n })
  })

  it('deserializes objects with mixed types', () => {
    const result = InteropArgs.deserialize({
      bigIntValue: 'BigInt(789)',
      stringValue: 'test',
      numberValue: 42,
      boolValue: true,
      nullValue: null,
    })
    expect(result).toEqual({
      bigIntValue: 789n,
      stringValue: 'test',
      numberValue: 42,
      boolValue: true,
      nullValue: null,
    })
  })

  it('deserializes empty objects', () => {
    const result = InteropArgs.deserialize({})
    expect(result).toEqual({})
  })

  it('deserializes nested arrays', () => {
    const result = InteropArgs.deserialize([
      ['BigInt(1)', 'BigInt(2)'],
      ['BigInt(3)', 'BigInt(4)'],
    ])
    expect(result).toEqual([
      [1n, 2n],
      [3n, 4n],
    ])
  })

  it('deserializes nested objects', () => {
    const result = InteropArgs.deserialize({
      outer: {
        inner: 'BigInt(123)',
      },
    })
    expect(result).toEqual({
      outer: {
        inner: 123n,
      },
    })
  })

  it('deserializes arrays in objects', () => {
    const result = InteropArgs.deserialize({
      values: ['BigInt(1)', 'BigInt(2)', 'BigInt(3)'],
      name: 'test',
    })
    expect(result).toEqual({
      values: [1n, 2n, 3n],
      name: 'test',
    })
  })

  it('deserializes objects in arrays', () => {
    const result = InteropArgs.deserialize([
      { a: 'BigInt(1)' },
      { b: 'BigInt(2)' },
    ])
    expect(result).toEqual([{ a: 1n }, { b: 2n }])
  })

  it('deserializes deeply nested structures', () => {
    const result = InteropArgs.deserialize({
      level1: {
        level2: {
          level3: [
            {
              bigIntValue: 'BigInt(999)',
              array: ['BigInt(1)', 'BigInt(2)'],
            },
          ],
        },
      },
    })
    expect(result).toEqual({
      level1: {
        level2: {
          level3: [
            {
              bigIntValue: 999n,
              array: [1n, 2n],
            },
          ],
        },
      },
    })
  })
})

describe('InteropArgs round-trip', () => {
  it('preserves bigint values through serialize and deserialize', () => {
    const original = 123456789n
    const serialized = InteropArgs.serialize(original)
    const deserialized = InteropArgs.deserialize(serialized)
    expect(deserialized).toEqual(original)
  })

  it('preserves primitive values through round-trip', () => {
    const values = ['hello', 123, true, false, null, undefined]
    for (const value of values) {
      const serialized = InteropArgs.serialize(value)
      const deserialized = InteropArgs.deserialize(serialized)
      expect(deserialized).toEqual(value)
    }
  })

  it('preserves complex structures through round-trip', () => {
    const original = {
      bigInts: [1n, 2n, 3n],
      nested: {
        value: 999n,
        array: [
          { a: 1n, b: 'text' },
          { a: 2n, b: 'more text' },
        ],
      },
      primitive: 'string',
      number: 42,
    }
    const serialized = InteropArgs.serialize(original)
    const deserialized = InteropArgs.deserialize(serialized)
    expect(deserialized).toEqual(original)
  })

  it('preserves empty structures through round-trip', () => {
    expect(InteropArgs.deserialize(InteropArgs.serialize([]))).toEqual([])
    expect(InteropArgs.deserialize(InteropArgs.serialize({}))).toEqual({})
  })
})
