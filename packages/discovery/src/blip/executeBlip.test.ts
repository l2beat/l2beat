import { expect } from 'earl'
import type { ContractValue } from '../discovery/output/types'
import { executeBlip } from './executeBlip'

describe(executeBlip.name, () => {
  // Contract value tests
  describe('contract value operations', () => {
    const contractValue = { a: 1, b: 'test' }

    it('can use contract values in comparisons', () => {
      expect(executeBlip(contractValue, ['=', 1, contractValue.a])).toEqual(
        true,
      )
      expect(
        executeBlip(contractValue, ['=', 'test', contractValue.b]),
      ).toEqual(true)
      expect(executeBlip(contractValue, ['!=', 2, contractValue.a])).toEqual(
        true,
      )
    })

    it('handles complex contract value expressions', () => {
      expect(
        executeBlip(contractValue, [
          'and',
          contractValue.a, // truthy check
          ['!=', contractValue.b, 'invalid'],
          ['=', contractValue.a, 1],
        ]),
      ).toEqual(true)
    })
  })

  it('supports complex nested logical expressions', () => {
    expect(
      executeBlip({}, [
        'and',
        ['not', false],
        'test',
        ['!=', 1, 2],
        ['=', 1, 1],
      ]),
    ).toEqual(true)

    expect(
      executeBlip({}, ['and', ['not', true], 'test', ['=', 1, 1]]),
    ).toEqual(false)
  })

  it('returns true only if all arguments are truthy', () => {
    expect(executeBlip({}, ['and', true, true, true])).toEqual(true)
    expect(executeBlip({}, ['and', true, false, true])).toEqual(false)
    expect(executeBlip({}, ['and', true, true, false])).toEqual(false)
    expect(executeBlip({}, ['and', 1, 'hello', true])).toEqual(true)
    expect(executeBlip({}, ['and', 1, '', true])).toEqual(false)
  })

  it('handles multiple and nested expressions', () => {
    expect(executeBlip({}, ['and', true, 1, ['not', false]])).toEqual(true)
    expect(executeBlip({}, ['and', true, 0, ['not', false]])).toEqual(false)
  })

  describe('equality comparisons', () => {
    it('compares multiple values for equality', () => {
      expect(executeBlip({}, ['=', 1, 1, 1])).toEqual(true)
      expect(executeBlip({}, ['=', 1, 2, 1])).toEqual(false)
      expect(executeBlip({}, ['=', 'a', 'a', 'a'])).toEqual(true)
      expect(executeBlip({}, ['=', 'a', 'b', 'a'])).toEqual(false)
    })

    it('works with different types', () => {
      expect(executeBlip({}, ['=', 1, '1'])).toEqual(false)
    })
  })

  describe('inequality comparisons', () => {
    it('compares multiple values for inequality', () => {
      expect(executeBlip({}, ['!=', 1, 2, 3])).toEqual(true)
      expect(executeBlip({}, ['!=', 1, 1, 2])).toEqual(true)
      expect(executeBlip({}, ['!=', 1, 1, 1])).toEqual(false)
      expect(executeBlip({}, ['!=', 'a', 'a', 'b'])).toEqual(true)
      expect(executeBlip({}, ['!=', 'a', 'b', 'c'])).toEqual(true)
      expect(executeBlip({}, ['!=', 'a', 'a', 'a'])).toEqual(false)
    })

    it('works with different types', () => {
      expect(executeBlip({}, ['!=', 1, '1'])).toEqual(true)
      expect(executeBlip({}, ['!=', 0, false])).toEqual(true)
    })
  })

  it('negates boolean values', () => {
    expect(executeBlip({}, ['not', true])).toEqual(false)
    expect(executeBlip({}, ['not', false])).toEqual(true)
  })

  it('handles nested not operations', () => {
    expect(executeBlip({}, ['not', ['not', true]])).toEqual(true)
    expect(executeBlip({}, ['not', ['not', false]])).toEqual(false)
  })

  it('executes simple values', () => {
    expect(executeBlip({}, 'string')).toEqual('string')
    expect(executeBlip({}, 123)).toEqual(123)
    expect(executeBlip({}, 0)).toEqual(0)
    expect(executeBlip({}, false)).toEqual(false)
    expect(executeBlip({}, true)).toEqual(true)
  })

  describe('get operations', () => {
    it('handles get operations for objects and arrays', () => {
      expect(executeBlip({ foo: 'bar' }, ['get', 'foo'])).toEqual('bar')
      expect(executeBlip({ a: 1, b: 2 }, ['get', 'b'])).toEqual(2)
      expect(executeBlip([10, 20, 30], ['get', 0])).toEqual(10)
      expect(executeBlip(['first', 'second'], ['get', 1])).toEqual('second')

      expect(
        executeBlip({ user: { name: 'Alice' } }, ['get', 'user', 'name']),
      ).toEqual('Alice')

      // Numeric string keys (should work for objects)
      expect(executeBlip({ '1': 'numeric key' }, ['get', '1'])).toEqual(
        'numeric key',
      )
    })

    it('throws on invalid get operations', () => {
      // Array index out of bounds
      expect(() => executeBlip([], ['get', 0])).toThrow(
        'Array index 0 out of bounds',
      )
      expect(() => executeBlip([1, 2, 3], ['get', 3])).toThrow(
        'Array index 3 out of bounds',
      )
      expect(() => executeBlip([1, 2, 3], ['get', -1])).toThrow(
        'Array index -1 out of bounds',
      )

      // Wrong key type for arrays
      expect(() => executeBlip([1, 2, 3], ['get', 'length'])).toThrow(
        'String keys only work on objects',
      )

      // Wrong key type for objects
      expect(() => executeBlip({ a: 1 }, ['get', 0])).toThrow(
        'Numeric keys only work on arrays',
      )

      // Missing keys
      expect(() => executeBlip({}, ['get', 'missing'])).toThrow(
        'Key not found in object',
      )

      // Non-object/non-array input
      expect(() => executeBlip('string', ['get', 'length'])).toThrow(
        'String keys only work on objects',
      )
      expect(() => executeBlip(123, ['get', 'toString'])).toThrow(
        'String keys only work on objects',
      )
    })

    it('handles complex nested get operations', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        meta: {
          count: 2,
          timestamp: 1234567890,
        },
      }

      // Get array element then object property
      expect(executeBlip(data, ['get', 'users', 1, 'name'])).toEqual('Bob')

      // Get nested object property
      expect(executeBlip(data, ['get', 'meta', 'timestamp'])).toEqual(
        1234567890,
      )

      // Chained gets
      expect(executeBlip(data, ['get', 'users', 0, 'id'])).toEqual(1)
    })

    it('handles edge cases for get operations', () => {
      // Empty string key
      expect(executeBlip({ '': 'empty key' }, ['get', ''])).toEqual('empty key')

      // Sparse arrays
      const sparse: string[] = []
      sparse[2] = 'item'
      expect(executeBlip(sparse, ['get', 2])).toEqual('item')
      expect(() => executeBlip(sparse, ['get', 1])).toThrow(
        'Key not found in object',
      )

      // Array-like objects
      const arrayLike = { 0: 'a', 1: 'b', length: 2 }
      expect(() => executeBlip(arrayLike, ['get', 0])).toThrow(
        'Numeric keys only work on arrays',
      )
      expect(executeBlip(arrayLike, ['get', '0'])).toEqual('a')
    })
  })

  describe('set operations', () => {
    it('handles basic set operations for objects', () => {
      const obj = { a: 1, b: 2 }
      expect(executeBlip(obj, ['set', 'a', 10])).toEqual({ a: 10, b: 2 })
      expect(executeBlip(obj, ['set', 'b', 3])).toEqual({ a: 1, b: 3 })
    })

    it('handles basic set operations for arrays', () => {
      const arr = [1, 2, 3]
      expect(executeBlip(arr, ['set', 0, 10])).toEqual([10, 2, 3])
      expect(executeBlip(arr, ['set', 2, 30])).toEqual([1, 2, 30])
    })

    it('handles set operations with expressions', () => {
      const obj = { a: 1, b: 2 }
      expect(executeBlip(obj, ['set', 'a', ['=', 2]])).toEqual({
        a: false,
        b: 2,
      })
      expect(executeBlip(obj, ['set', 'b', ['not', true]])).toEqual({
        a: 1,
        b: false,
      })
    })

    it('handles nested set operations', () => {
      const data = {
        user: {
          name: 'Alice',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
      }

      expect(executeBlip(data, ['set', ['user', 'name'], 'Bob'])).toEqual({
        user: {
          name: 'Bob',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
      })

      expect(
        executeBlip(data, ['set', ['user', 'settings', 'theme'], 'light']),
      ).toEqual({
        user: {
          name: 'Alice',
          settings: {
            theme: 'light',
            notifications: true,
          },
        },
      })
    })

    it('handles complex nested set operations with arrays', () => {
      const data = {
        users: [
          {
            id: 1,
            profile: {
              name: 'Alice',
              preferences: {
                colors: ['red', 'blue'],
                notifications: {
                  email: true,
                  sms: false,
                },
              },
            },
          },
          {
            id: 2,
            profile: {
              name: 'Bob',
              preferences: {
                colors: ['green'],
                notifications: {
                  email: false,
                  sms: true,
                },
              },
            },
          },
        ],
        system: {
          defaultSettings: {
            theme: 'light',
            timeout: 30,
          },
        },
      }

      // Modify array element within nested object
      expect(
        executeBlip(data, [
          'set',
          ['users', 0, 'profile', 'preferences', 'colors', 1],
          'purple',
        ]),
      ).toEqual({
        users: [
          {
            id: 1,
            profile: {
              name: 'Alice',
              preferences: {
                colors: ['red', 'purple'],
                notifications: {
                  email: true,
                  sms: false,
                },
              },
            },
          },
          {
            id: 2,
            profile: {
              name: 'Bob',
              preferences: {
                colors: ['green'],
                notifications: {
                  email: false,
                  sms: true,
                },
              },
            },
          },
        ],
        system: {
          defaultSettings: {
            theme: 'light',
            timeout: 30,
          },
        },
      })

      // Modify system settings while keeping user data intact
      expect(
        executeBlip(data, [
          'set',
          ['system', 'defaultSettings', 'timeout'],
          60,
        ]),
      ).toEqual({
        users: [
          {
            id: 1,
            profile: {
              name: 'Alice',
              preferences: {
                colors: ['red', 'blue'],
                notifications: {
                  email: true,
                  sms: false,
                },
              },
            },
          },
          {
            id: 2,
            profile: {
              name: 'Bob',
              preferences: {
                colors: ['green'],
                notifications: {
                  email: false,
                  sms: true,
                },
              },
            },
          },
        ],
        system: {
          defaultSettings: {
            theme: 'light',
            timeout: 60,
          },
        },
      })
    })

    it('throws on invalid set operations', () => {
      // Array index out of bounds
      expect(() => executeBlip([1, 2], ['set', 2, 3])).toThrow(
        'Array index 2 out of bounds',
      )
      expect(() => executeBlip([1, 2], ['set', -1, 0])).toThrow(
        'Array index -1 out of bounds',
      )

      // Wrong key type for arrays
      expect(() => executeBlip([1, 2, 3], ['set', 'length', 5])).toThrow(
        'String keys only work on objects',
      )

      // Wrong key type for objects
      expect(() => executeBlip({ a: 1 }, ['set', 0, 10])).toThrow(
        'Numeric keys only work on arrays',
      )
    })

    it('does not modify the original object', () => {
      const original = { a: 1, b: { c: 2 } }
      const result = executeBlip(original, ['set', 'a', 10])

      expect(result).toEqual({ a: 10, b: { c: 2 } })
      expect(original).toEqual({ a: 1, b: { c: 2 } })

      // Check deep cloning
      const nestedResult = executeBlip(original, ['set', 'b', ['set', 'c', 20]])
      expect(nestedResult).toEqual({ a: 1, b: { c: 20 } })
      expect(original).toEqual({ a: 1, b: { c: 2 } })
    })

    it('handles nested arrays within objects', () => {
      const data = {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      }

      expect(executeBlip(data, ['set', ['matrix', 0, 1], 99])).toEqual({
        matrix: [
          [1, 99],
          [3, 4],
        ],
      })
    })

    it('handles objects within arrays', () => {
      const data = [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
      ]

      expect(executeBlip(data, ['set', [0, 'value'], 'x'])).toEqual([
        { id: 1, value: 'x' },
        { id: 2, value: 'b' },
      ])
    })

    it('throws when trying to set non-existent paths', () => {
      const obj = { a: { b: 1 } }
      expect(() => executeBlip(obj, ['set', ['a', 'c'], 2])).toThrow(
        'Key not found in object',
      )
      expect(() => executeBlip(obj, ['set', ['x'], 1])).toThrow(
        'Key not found in object',
      )

      const arr = [[1]]
      expect(() => executeBlip(arr, ['set', [0, 1], 2])).toThrow(
        'Array index 1 out of bounds',
      )
    })
  })

  describe('pick operations', () => {
    it('picks specified keys from an object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 }
      expect(executeBlip(obj, ['pick', 'a', 'c'])).toEqual({ a: 1, c: 3 })
    })

    it('ignores keys that do not exist in the object', () => {
      const obj = { a: 1, b: 2 }
      expect(executeBlip(obj, ['pick', 'a', 'z'])).toEqual({ a: 1 })
    })

    it('returns an empty object when no keys match', () => {
      const obj = { a: 1, b: 2 }
      expect(executeBlip(obj, ['pick', 'x', 'y'])).toEqual({})
    })

    it('works with dynamic key expressions', () => {
      const obj = { a: 1, b: 2, key: 'a' }
      expect(executeBlip(obj, ['pick', ['get', 'key']])).toEqual({ a: 1 })
    })

    it('throws when input is not an object', () => {
      expect(() => executeBlip([1, 2, 3], ['pick', 'a'])).toThrow(
        'pick requires an object input',
      )
      expect(() => executeBlip('string', ['pick', 'a'])).toThrow(
        'pick requires an object input',
      )
      expect(() => executeBlip(123, ['pick', 'a'])).toThrow(
        'pick requires an object input',
      )
    })

    it('throws when key expressions do not resolve to strings', () => {
      const obj = { a: 1, b: 2 }
      expect(() => executeBlip(obj, ['pick', ['=', 1, 1]])).toThrow(
        'pick keys must be strings',
      )
    })

    it('handles nested objects correctly', () => {
      const obj = {
        a: 1,
        b: { x: 10, y: 20 },
        c: 3,
      }
      expect(executeBlip(obj, ['pick', 'a', 'b'])).toEqual({
        a: 1,
        b: { x: 10, y: 20 },
      })
    })

    it('works with empty key list', () => {
      const obj = { a: 1, b: 2 }
      expect(executeBlip(obj, ['pick'])).toEqual({})
    })
  })

  describe('filter operations', () => {
    it('filters an array based on a predicate', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(executeBlip(arr, ['filter', ['=', 2]])).toEqual([2])
    })

    it('returns an empty array when no elements match', () => {
      const arr = [1, 2, 3]
      expect(executeBlip(arr, ['filter', ['=', 10]])).toEqual([])
    })

    it('returns the original array when all elements match', () => {
      const arr = [1, 2, 3]
      expect(executeBlip(arr, ['filter', ['!=', 10]])).toEqual([1, 2, 3])
    })

    it('works with complex predicates', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(
        executeBlip(arr, ['filter', ['and', ['!=', 2], ['!=', 4]]]),
      ).toEqual([1, 3, 5])
    })

    it('filters arrays of objects', () => {
      const users = [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
        { id: 3, name: 'Charlie', active: true },
      ]
      expect(executeBlip(users, ['filter', ['get', 'active']])).toEqual([
        { id: 1, name: 'Alice', active: true },
        { id: 3, name: 'Charlie', active: true },
      ])
    })

    it('throws when input is not an array', () => {
      expect(() => executeBlip({}, ['filter', ['=', 1]])).toThrow(
        'Filtering is only supported for arrays',
      )
      expect(() => executeBlip('string', ['filter', ['=', 1]])).toThrow(
        'Filtering is only supported for arrays',
      )
      expect(() => executeBlip(123, ['filter', ['=', 1]])).toThrow(
        'Filtering is only supported for arrays',
      )
    })

    it('works with nested arrays', () => {
      const arr = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      expect(executeBlip(arr, ['filter', ['=', 2, ['get', 1]]])).toEqual([
        [1, 2],
      ])
    })
  })

  describe('find operations', () => {
    it('finds the first element matching a predicate', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(executeBlip(arr, ['find', ['=', 3]])).toEqual(3)
    })

    it('throws when no elements match', () => {
      const arr = [1, 2, 3]
      expect(() => executeBlip(arr, ['find', ['=', 10]])).toThrow(
        'No matching item found',
      )
    })

    it('returns the first matching element when multiple match', () => {
      const arr = [1, 2, 2, 3]
      expect(executeBlip(arr, ['find', ['=', 2]])).toEqual(2)
    })

    it('finds objects in arrays', () => {
      const users = [
        { id: 1, name: 'Alice', active: false },
        { id: 2, name: 'Bob', active: true },
        { id: 3, name: 'Charlie', active: true },
      ]
      expect(executeBlip(users, ['find', ['get', 'active']])).toEqual({
        id: 2,
        name: 'Bob',
        active: true,
      })
    })

    it('throws when input is not an array', () => {
      expect(() => executeBlip({}, ['find', ['=', 1]])).toThrow(
        'Finding is only supported for arrays',
      )
      expect(() => executeBlip('string', ['find', ['=', 1]])).toThrow(
        'Finding is only supported for arrays',
      )
      expect(() => executeBlip(123, ['find', ['=', 1]])).toThrow(
        'Finding is only supported for arrays',
      )
    })
  })

  describe('map operations', () => {
    it('applies a function to each element of an array', () => {
      const arr = [1, 2, 3]
      expect(executeBlip(arr, ['map', ['=', 2]])).toEqual([false, true, false])
    })

    it('works with complex expressions using implemented operations', () => {
      const arr = [1, 2, 3, 4]
      expect(
        executeBlip(arr, ['map', ['and', ['=', 3], ['not', false]]]),
      ).toEqual([false, false, true, false])
    })

    it('handles empty arrays', () => {
      expect(executeBlip([], ['map', ['not', false]])).toEqual([])
    })

    it('works with arrays of objects', () => {
      const arr = [{ a: 1 }, { a: 2 }, { a: 3 }]
      expect(executeBlip(arr, ['map', ['get', 'a']])).toEqual([1, 2, 3])
    })

    it('preserves array length', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(executeBlip(arr, ['map', ['=', 3]])).toEqual([
        false,
        false,
        true,
        false,
        false,
      ])
    })

    it('throws when input is not an array', () => {
      expect(() => executeBlip({}, ['map', ['=', 1]])).toThrow(
        'map requires an array input',
      )
      expect(() => executeBlip('string', ['map', ['=', 1]])).toThrow(
        'map requires an array input',
      )
      expect(() => executeBlip(123, ['map', ['=', 1]])).toThrow(
        'map requires an array input',
      )
    })

    it('can access the original array elements in expressions', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]
      expect(executeBlip(users, ['map', ['pick', 'name']])).toEqual([
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
      ])
    })

    it('handles nested arrays', () => {
      const arr = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      expect(executeBlip(arr, ['map', ['get', 0]])).toEqual([1, 3, 5])
    })

    it('handles edge cases with boolean expressions', () => {
      const arr = [true, false, true]
      expect(executeBlip(arr, ['map', ['not']])).toEqual([false, true, false])
    })

    it('applies expressions that reference the element context', () => {
      const arr = [1, 2, 3]
      expect(
        executeBlip(arr, ['map', ['and', ['=', 1], ['not', false]]]),
      ).toEqual([true, false, false])
    })
  })

  describe('pipe operations', () => {
    it('applies a sequence of operations to a value', () => {
      const data = { a: 1 }
      expect(executeBlip(data, ['pipe', ['get', 'a'], ['=', 1]])).toEqual(true)
    })

    it('passes the result of each operation to the next', () => {
      const data = { users: [{ name: 'Alice' }, { name: 'Bob' }] }
      expect(
        executeBlip(data, ['pipe', ['get', 'users'], ['map', ['get', 'name']]]),
      ).toEqual(['Alice', 'Bob'])
    })

    it('works with arrays', () => {
      const arr = [1, 2, 3]
      expect(executeBlip(arr, ['pipe', ['map', ['=', 2]]])).toEqual([
        false,
        true,
        false,
      ])
    })

    it('works with objects', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(executeBlip(obj, ['pipe', ['pick', 'a', 'b']])).toEqual({
        a: 1,
        b: 2,
      })
    })

    it('handles complex transformations using implemented operations', () => {
      const data = {
        users: [
          { id: 1, name: 'Alice', active: true },
          { id: 2, name: 'Bob', active: false },
          { id: 3, name: 'Charlie', active: true },
        ],
      }

      expect(
        executeBlip(data, [
          'pipe',
          ['get', 'users'],
          ['map', ['pick', 'name', 'active']],
        ]),
      ).toEqual([
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
        { name: 'Charlie', active: true },
      ])
    })

    it('returns the input value when no operations are provided', () => {
      expect(executeBlip(42, ['pipe'])).toEqual(42)
    })

    it('handles single operation pipes', () => {
      const data = { a: 1 }
      expect(executeBlip(data, ['pipe', ['get', 'a']])).toEqual(1)
    })

    it('works with boolean operations', () => {
      expect(executeBlip(true, ['pipe', ['not'], ['not']])).toEqual(true)
      expect(executeBlip(false, ['pipe', ['not']])).toEqual(true)
    })

    it('can transform between different types', () => {
      const arr = [true, false, true]
      expect(executeBlip(arr, ['pipe', ['map', ['not']]])).toEqual([
        false,
        true,
        false,
      ])
    })

    it('handles nested pipes', () => {
      const data = { a: 1, b: 2 }
      expect(
        executeBlip(data, [
          'pipe',
          ['pick', 'a'],
          ['pipe', ['get', 'a'], ['=', 1]],
        ]),
      ).toEqual(true)
    })

    it('handles edge cases with empty inputs', () => {
      expect(() => executeBlip({}, ['pipe', ['get', 'missing']])).toThrow(
        // Assuming 'get' throws on missing key
        'Key not found in object',
      )
    })
  })

  describe('delete operations', () => {
    it('deletes multiple keys from an object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 }
      expect(executeBlip(obj, ['delete', 'b', 'd'])).toEqual({ a: 1, c: 3 })
      expect(executeBlip(obj, ['delete', 'a'])).toEqual({ b: 2, c: 3, d: 4 }) // Single key as array
    })

    it('deletes multiple keys including non-existent ones from an object', () => {
      const obj = { a: 1, b: 2 }
      expect(executeBlip(obj, ['delete', 'a', 'z', 'b'])).toEqual({}) // All deleted, including non-existent
      expect(executeBlip(obj, ['delete', 'z', 'x'])).toEqual({ a: 1, b: 2 }) // Non-existent keys do nothing
    })

    it('deletes multiple indices from an array sequentially', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(executeBlip(arr, ['delete', 0, 2])).toEqual([2, 4, 5]) // After deleting 0, array is [2,3,4,5], then delete index 2 (which is 4)
      expect(executeBlip(arr, ['delete', 1])).toEqual([1, 3, 4, 5]) // Single index
    })

    it('throws when deleting with out-of-bounds indices in arrays', () => {
      const arr = [1, 2, 3]
      expect(() => executeBlip(arr, ['delete', 1, 5])).toThrow(
        'Array index 5 out of bounds',
      ) // First valid, second invalid
      expect(() => executeBlip(arr, ['delete', -1, 0])).toThrow(
        'Array index -1 out of bounds',
      )
      expect(() => executeBlip(arr, ['delete', 2])).not.toThrow() // Valid single
    })

    it('throws when input is not an array or object', () => {
      expect(() => executeBlip(123, ['delete', 'key'])).toThrow(
        'delete requires an array or object input',
      )
    })

    it('throws when key type is incorrect for arrays or objects', () => {
      const arr = [1, 2, 3]
      expect(() => executeBlip(arr, ['delete', 'a', 1])).toThrow(
        'Array access requires a number key',
      ) // First key invalid
      expect(() => executeBlip(arr, ['delete', 1, 'b'])).toThrow(
        'Array access requires a number key',
      ) // Second key invalid

      const obj = { a: 1 }
      expect(() => executeBlip(obj, ['delete', 0, 'a'])).toThrow(
        'Object access requires a string key',
      ) // First key invalid
    })

    it('does not modify the original object or array', () => {
      const originalObj = { a: 1, b: 2, c: 3 }
      const resultObj = executeBlip(originalObj, ['delete', 'b', 'c'])
      expect(resultObj).toEqual({ a: 1 })
      expect(originalObj).toEqual({ a: 1, b: 2, c: 3 })

      const originalArr = [1, 2, 3, 4]
      const resultArr = executeBlip(originalArr, ['delete', 0, 2])
      expect(resultArr).toEqual([2, 4]) // After sequential deletion
      expect(originalArr).toEqual([1, 2, 3, 4])
    })

    it('handles edge cases for empty structures and key lists', () => {
      const emptyObj = {}
      expect(executeBlip(emptyObj, ['delete'])).toEqual({}) // Empty keys array
      expect(executeBlip(emptyObj, ['delete', 'key'])).toEqual({}) // Non-existent key

      const emptyArr: any[] = []
      expect(() => executeBlip(emptyArr, ['delete', 0])).toThrow(
        'Array index 0 out of bounds',
      )
      expect(executeBlip(emptyArr, ['delete'])).toEqual([]) // Empty keys array on empty array
    })

    it('processes keys sequentially and handles mixed valid/invalid scenarios', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(executeBlip(obj, ['delete', 'a', 'b'])).toEqual({ c: 3 })

      const arr = [1, 2, 3, 4]
      expect(() => executeBlip(arr, ['delete', 0, 5, 1])).toThrow(
        'Array index 5 out of bounds',
      )
    })
  })

  describe('shape operations', () => {
    it('reshapes an array into an object with specified keys', () => {
      const input = [1, 2, 3]
      const result = executeBlip(input, ['shape', 'a', 'b', 'c'])
      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('reshapes an object into another object using values in insertion order', () => {
      const input = { x: 'one', y: 'two', z: 'three' }
      const result = executeBlip(input, ['shape', 'first', 'second', 'third'])
      expect(result).toEqual({ first: 'one', second: 'two', third: 'three' })
    })

    it('ignores keys that are undefined or extra elements', () => {
      const input = [10, 20]
      const result = executeBlip(input, ['shape', 'x'])
      expect(result).toEqual({ x: 10 })
    })

    it('supports key filters in [key, filter] form', () => {
      const input = [10, 20]
      const result = executeBlip(input, [
        'shape',
        ['x', ['=', 10]],
        ['y', ['not', false]],
      ])
      expect(result).toEqual({ x: true, y: true })
    })

    it('reshapes sparse arrays correctly', () => {
      const input: any[] = []
      input[1] = 'hello'
      const result = executeBlip(input, ['shape', 'a', 'b'])
      expect(result).toEqual({ b: 'hello' })
    })

    it('reshapes object with nested filter expressions', () => {
      const input = { one: 1, two: 2, three: 3 }
      const result = executeBlip(input, [
        'shape',
        ['sum', ['=', 1]],
        ['isTwo', ['=', 2]],
      ])
      expect(result).toEqual({ sum: true, isTwo: true })
    })

    it('handles simple shape on an array', () => {
      const inputArray = ['value1', 'value2', 'value3', 'value4']
      expect(executeBlip(inputArray, ['shape', 'a', 'b', 'c', 'd'])).toEqual({
        a: 'value1',
        b: 'value2',
        c: 'value3',
        d: 'value4',
      })
    })

    it('handles simple shape on an object', () => {
      const inputObject = { key1: 'value1', key2: 'value2', key3: 'value3' }
      expect(executeBlip(inputObject, ['shape', 'a', 'b', 'c'])).toEqual({
        a: 'value1',
        b: 'value2',
        c: 'value3',
      })
    })

    it('handles complex shape with various transformations on an array', () => {
      const inputArray = [
        'Alice',
        { age: 30 },
        true,
        { profile: { avatar: 'image.jpg', bio: 'Developer' } },
      ]
      expect(
        executeBlip(inputArray, [
          'shape',
          'name',
          ['ageValue', ['get', 'age']],
          ['isActive', ['=', true]],
          ['profileData', ['get', 'profile']],
        ]),
      ).toEqual({
        name: 'Alice',
        ageValue: 30,
        isActive: true,
        profileData: { avatar: 'image.jpg', bio: 'Developer' },
      })
    })

    it('handles complex shape with various transformations on an object', () => {
      const inputObject = {
        key1: 'Alice',
        key2: { age: 30 },
        key3: true,
        key4: { profile: { avatar: 'image.jpg', bio: 'Developer' } },
      }
      expect(
        executeBlip(inputObject, [
          'shape',
          'name',
          ['ageValue', ['get', 'age']],
          ['isActive', ['=', true]],
          ['profileData', ['get', 'profile']],
        ]),
      ).toEqual({
        name: 'Alice',
        ageValue: 30,
        isActive: true,
        profileData: { avatar: 'image.jpg', bio: 'Developer' },
      })
    })

    it('throws an error for invalid inputs to shape', () => {
      expect(() => executeBlip(123, ['shape', 'a', 'b'])).toThrow(
        'Shape operation requires an array or object as input',
      )
      expect(() => executeBlip('string', ['shape', 'a'])).toThrow(
        'Shape operation requires an array or object as input',
      )
    })

    it('handles edge cases with fewer elements than keys', () => {
      const inputArray = [1, 2]

      // 'c' will not be set due to no third element, as per the implementation
      expect(executeBlip(inputArray, ['shape', 'a', 'b', 'c'])).toEqual({
        a: 1,
        b: 2,
      })
    })

    it('handles shape with nested operations correctly', () => {
      const inputArray = ['test', { subKey: 'subValue' }]
      expect(
        executeBlip(inputArray, [
          'shape',
          'test',
          ['outerKey', ['get', 'subKey']],
        ]),
      ).toEqual({ test: 'test', outerKey: 'subValue' })
    })
  })

  describe('to_entries operations', () => {
    it('works with objects', () => {
      const input = { x: 'one', y: 'two', z: 'three' }
      const result = executeBlip(input, ['to_entries'])
      expect(result).toEqual([
        ['x', 'one'],
        ['y', 'two'],
        ['z', 'three'],
      ])
    })

    it('works with arrays', () => {
      const input = [1, 2, 3]
      const result = executeBlip(input, ['to_entries'])
      expect(result).toEqual([
        ['0', 1],
        ['1', 2],
        ['2', 3],
      ])
    })

    it('works with empty objects', () => {
      const input = {}
      const result = executeBlip(input, ['to_entries'])
      expect(result).toEqual([])
    })

    it('works with empty arrays', () => {
      const input: ContractValue[] = []
      const result = executeBlip(input, ['to_entries'])
      expect(result).toEqual([])
    })
  })

  describe('length operations', () => {
    it('returns length of arrays', () => {
      expect(executeBlip([1, 2, 3], ['length'])).toEqual(3)
      expect(executeBlip([], ['length'])).toEqual(0)
      expect(executeBlip(['a', 'b', 'c', 'd'], ['length'])).toEqual(4)
    })

    it('returns length of objects', () => {
      expect(executeBlip({ a: 1, b: 2 }, ['length'])).toEqual(2)
      expect(executeBlip({}, ['length'])).toEqual(0)
      expect(
        executeBlip({ x: 'one', y: 'two', z: 'three' }, ['length']),
      ).toEqual(3)
    })

    it('returns length of strings', () => {
      expect(executeBlip('hello', ['length'])).toEqual(5)
      expect(executeBlip('', ['length'])).toEqual(0)
      expect(executeBlip('test string', ['length'])).toEqual(11)
    })

    it('throws on invalid inputs', () => {
      expect(() => executeBlip(123, ['length'])).toThrow(
        'length requires an array, object, or string input',
      )
      expect(() => executeBlip(null as any, ['length'])).toThrow(
        'length requires an array, object, or string input',
      )
      expect(() => executeBlip(true, ['length'])).toThrow(
        'length requires an array, object, or string input',
      )
    })

    it('can be used in pipe operations', () => {
      expect(executeBlip([1, 2, 3], ['pipe', ['length'], ['=', 3]])).toEqual(
        true,
      )
      expect(
        executeBlip({ a: 1, b: 2 }, ['pipe', ['length'], ['!=', 0]]),
      ).toEqual(true)
      expect(executeBlip('hello', ['pipe', ['length'], ['!=', 10]])).toEqual(
        true,
      )
    })
  })
})
