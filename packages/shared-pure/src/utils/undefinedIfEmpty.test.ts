import { describe, expect, it } from 'vitest'
import { undefinedIfEmpty } from './undefinedIfEmpty.js'

describe(undefinedIfEmpty.name, () => {
  it('returns undefined if array is empty', () => {
    expect(undefinedIfEmpty([])).toBe(undefined)
  })

  it('returns array if array has one element', () => {
    expect(undefinedIfEmpty([1])).toEqual([1])
  })

  it('returns array if array has more than one element', () => {
    expect(undefinedIfEmpty([1, 2, 3])).toEqual([1, 2, 3])
  })
})
