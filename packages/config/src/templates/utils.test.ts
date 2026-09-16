import { describe, expect, it } from 'vitest'

import { asArray, emptyArrayToUndefined } from './utils'

describe(asArray.name, () => {
  it('handles undefined inputs', () => {
    expect(asArray(undefined)).toStrictEqual([])

    expect(asArray('value')).toStrictEqual(['value'])

    const original = ['a', 'b']
    const result = asArray(original)

    expect(result).toStrictEqual(['a', 'b'])

    original.push('c')
    expect(result).toStrictEqual(['a', 'b', 'c'])
  })
})

describe(emptyArrayToUndefined.name, () => {
  it('returns undefined for empty arrays', () => {
    expect(emptyArrayToUndefined([])).toStrictEqual(undefined)

    const original = ['x']
    const result = emptyArrayToUndefined(original)

    expect(result).toStrictEqual(['x'])

    original.push('y')
    expect(result).toStrictEqual(['x', 'y'])
  })
})
