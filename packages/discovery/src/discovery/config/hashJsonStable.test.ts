import { expect } from 'earl'

import { hashJsonStable } from './hashJsonStable'

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
