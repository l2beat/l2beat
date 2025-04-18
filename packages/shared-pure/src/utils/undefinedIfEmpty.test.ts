import { expect } from 'earl'
import { undefinedIfEmpty } from './undefinedIfEmpty'

describe(undefinedIfEmpty.name, () => {
  it('returns undefined if array is empty', () => {
    expect(undefinedIfEmpty([])).toEqual(undefined)
  })

  it('returns array if array has one element', () => {
    expect(undefinedIfEmpty([1])).toEqual([1])
  })

  it('returns array if array has more than one element', () => {
    expect(undefinedIfEmpty([1, 2, 3])).toEqual([1, 2, 3])
  })
})
