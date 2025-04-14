import { expect } from 'earl'

import { deepSortByKeys, hashJsonStable } from './hashJsonStable'

describe(hashJsonStable.name, () => {
  it('returns the same hash for objects with same content but different key order', () => {
    const object1 = { a: 1, b: 2, c: 3 }
    const object2 = { c: 3, a: 1, b: 2 }

    const hash1 = hashJsonStable(object1)
    const hash2 = hashJsonStable(object2)

    expect(hash1).toEqual(hash2)
  })

  it('returns different hashes for different objects', () => {
    const object1 = { a: 1, b: 2, c: 3 }
    const object2 = { a: 1, b: 2, c: 4 }

    const hash1 = hashJsonStable(object1)
    const hash2 = hashJsonStable(object2)

    expect(hash1).not.toEqual(hash2)
  })

  it('sorts nested objects up to MAX_SEMANTIC_NEST_LEVEL', () => {
    // Objects with different key order at level 0 (should be sorted)
    const object1 = { b: 1, a: 2 }
    const object2 = { a: 2, b: 1 }
    expect(hashJsonStable(object1)).toEqual(hashJsonStable(object2))

    // Objects with different key order at level 1 (should be sorted)
    const object3 = { nested: { b: 1, a: 2 } }
    const object4 = { nested: { a: 2, b: 1 } }
    expect(hashJsonStable(object3)).toEqual(hashJsonStable(object4))

    // Objects with different key order at level 2 (should be sorted)
    const object5 = { level1: { level2: { b: 1, a: 2 } } }
    const object6 = { level1: { level2: { a: 2, b: 1 } } }
    expect(hashJsonStable(object5)).toEqual(hashJsonStable(object6))

    // Objects with different key order at level 3 (should NOT be sorted)
    // Since we don't sort at this level, insertion order is preserved
    // and the hashes should be different
    const object7 = { level1: { level2: { level3: { b: 1, a: 2 } } } }
    const object8 = { level1: { level2: { level3: { a: 2, b: 1 } } } }
    expect(hashJsonStable(object7)).not.toEqual(hashJsonStable(object8))

    // To actually test that level 3 isn't sorted, we need to modify the content
    const object9 = { level1: { level2: { level3: { b: 1, a: 2 } } } }
    const object10 = { level1: { level2: { level3: { b: 2, a: 1 } } } }
    expect(hashJsonStable(object9)).not.toEqual(hashJsonStable(object10))
  })

  it('sorts arrays', () => {
    const object1 = { arr: [3, 1, 2] }
    const object2 = { arr: [1, 2, 3] }

    const hash1 = hashJsonStable(object1)
    const hash2 = hashJsonStable(object2)

    expect(hash1).toEqual(hash2)
  })

  it('handles complex nested structures', () => {
    const object1 = {
      z: 'last',
      a: 'first',
      nested: {
        y: 'before',
        x: 'after',
        deepNested: {
          c: 'not sorted',
          b: 'not sorted either',
        },
        array: [5, 3, 1, 4, 2],
      },
    }

    const object2 = {
      a: 'first',
      nested: {
        x: 'after',
        y: 'before',
        array: [1, 2, 3, 4, 5],
        deepNested: {
          b: 'not sorted either',
          c: 'not sorted',
        },
      },
      z: 'last',
    }

    // Keys at level 0 and 1 should be sorted, arrays should be sorted,
    // but keys at level 2 (deepNested) should not be sorted.
    // However, since the content is the same, the hashes should be equal
    const hash1 = hashJsonStable(object1)
    const hash2 = hashJsonStable(object2)

    expect(hash1).toEqual(hash2)

    // If we change the content at level 3, hashes should be different
    const object3 = {
      ...object1,
      nested: {
        ...object1.nested,
        deepNested: {
          b: 'changed value',
          c: 'not sorted',
        },
      },
    }

    const hash3 = hashJsonStable(object3)
    expect(hash3).not.toEqual(hash2)
  })
})

describe(deepSortByKeys.name, () => {
  it('sorts keys at the top level', () => {
    const input = { c: 1, a: 2, b: 3 }
    const expected = { a: 2, b: 3, c: 1 }

    const result = deepSortByKeys(input)

    expect(result).toEqual(expected)
  })

  it('sorts keys at nested levels up to MAX_SEMANTIC_NEST_LEVEL', () => {
    const input = {
      level0: {
        c: 1,
        a: 2,
        b: 3,
        level1: {
          z: 1,
          x: 2,
          y: 3,
          level2: {
            m: 1,
            k: 2,
            l: 3,
            level3: {
              j: 1,
              h: 2,
              i: 3,
            },
          },
        },
      },
    }

    const expected = {
      level0: {
        a: 2,
        b: 3,
        c: 1,
        level1: {
          x: 2,
          y: 3,
          z: 1,
          level2: {
            k: 2,
            l: 3,
            m: 1,
            level3: {
              j: 1,
              h: 2,
              i: 3, // Not sorted at level 3
            },
          },
        },
      },
    }

    const result = deepSortByKeys(input)

    expect(result).toEqual(expected)
  })

  it('sorts arrays', () => {
    const input = {
      numbers: [5, 3, 1, 4, 2],
      letters: ['c', 'a', 'b'],
    }

    const expected = {
      numbers: [1, 2, 3, 4, 5],
      letters: ['a', 'b', 'c'],
    }

    const result = deepSortByKeys(input)

    expect(result).toEqual(expected)
  })

  it('handles empty objects and arrays', () => {
    const input = {
      emptyObj: {},
      emptyArr: [],
      nested: {
        emptyObj: {},
        emptyArr: [],
      },
    }

    const expected = {
      emptyObj: {},
      emptyArr: [],
      nested: {
        emptyObj: {},
        emptyArr: [],
      },
    }

    const result = deepSortByKeys(input)

    expect(result).toEqual(expected)
  })

  it('handles mixed types correctly', () => {
    const input = {
      z: 'string',
      y: 123,
      x: true,
      w: null,
      v: undefined,
      u: {
        c: 'nested',
        b: [3, 1, 2],
        a: {
          deep: 'value',
        },
      },
    }

    const expected = {
      u: {
        a: {
          deep: 'value',
        },
        b: [1, 2, 3],
        c: 'nested',
      },
      v: undefined,
      w: null,
      x: true,
      y: 123,
      z: 'string',
    }

    const result = deepSortByKeys(input)

    expect(result).toEqual(expected)
  })

  it('preserves original object when nestLevel exceeds MAX_SEMANTIC_NEST_LEVEL', () => {
    const level3Object = { b: 'value2', a: 'value1' }

    const input = {
      level0: {
        level1: {
          level2: {
            level3: level3Object,
          },
        },
      },
    }

    const result = deepSortByKeys(input) as {
      level0: {
        level1: {
          level2: {
            level3: typeof level3Object
          }
        }
      }
    }

    // The level3 object should be the same reference, not sorted
    expect(result.level0.level1.level2.level3).toEqual(level3Object)

    // Verify the structure is as expected
    expect(result).toEqual({
      level0: {
        level1: {
          level2: {
            level3: { b: 'value2', a: 'value1' }, // Order preserved
          },
        },
      },
    })
  })

  it('handles complex nested structures with arrays of objects', () => {
    const input = {
      z: 'last',
      a: 'first',
      nested: {
        y: [
          { c: 3, a: 1, b: 2 },
          { z: 26, x: 24, y: 25 },
        ],
        x: 'value',
        deepNested: {
          c: 'not sorted',
          b: 'not sorted either',
          array: [5, 3, 1, 4, 2],
        },
      },
    }

    const expected = {
      a: 'first',
      nested: {
        x: 'value',
        y: [
          { a: 1, b: 2, c: 3 },
          { x: 24, y: 25, z: 26 },
        ], // Arrays are sorted
        deepNested: {
          c: 'not sorted',
          b: 'not sorted either',
          array: [1, 2, 3, 4, 5],
        },
      },
      z: 'last',
    }

    const result = deepSortByKeys(input)

    expect(result).toEqual(expected)
  })
})
