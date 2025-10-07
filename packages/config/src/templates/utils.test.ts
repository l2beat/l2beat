import { expect } from 'earl'

import { asArray, emptyArrayToUndefined } from './utils'

describe(asArray.name, () => {
  it('handles undefined inputs', () => {
    expect(asArray(undefined)).toEqual([])

    expect(asArray('value')).toEqual(['value'])

    const original = ['a', 'b']
    const result = asArray(original)

    expect(result).toEqual(['a', 'b'])

    original.push('c')
    expect(result).toEqual(['a', 'b', 'c'])
  })
})

describe(emptyArrayToUndefined.name, () => {
  it('returns undefined for empty arrays', () => {
    expect(emptyArrayToUndefined([])).toEqual(undefined)

    const original = ['x']
    const result = emptyArrayToUndefined(original)

    expect(result).toEqual(['x'])

    original.push('y')
    expect(result).toEqual(['x', 'y'])
  })
})
