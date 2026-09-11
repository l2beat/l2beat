import { expect } from 'earl'
import {
  parseHiddenColumns,
  toHiddenColumns,
  toVisibilityState,
} from './useTable'

describe(parseHiddenColumns.name, () => {
  it('accepts an array of column ids', () => {
    expect(parseHiddenColumns('["a","b"]')).toEqual(['a', 'b'])
  })

  it('falls back to no hidden columns for anything else', () => {
    expect(parseHiddenColumns('not json')).toEqual([])
    expect(parseHiddenColumns('{"a":false}')).toEqual([])
    expect(parseHiddenColumns('[1,"a"]')).toEqual([])
    expect(parseHiddenColumns('null')).toEqual([])
  })
})

describe(toVisibilityState.name, () => {
  it('marks only the given ids as hidden', () => {
    expect(toVisibilityState(['a', 'b'])).toEqual({ a: false, b: false })
    expect(toVisibilityState([])).toEqual({})
  })
})

describe(toHiddenColumns.name, () => {
  it('keeps only ids that are hidden', () => {
    expect(toHiddenColumns({ a: false, b: true, c: false })).toEqual(['a', 'c'])
  })

  it('round-trips through the visibility state', () => {
    const hidden = ['x', 'y']
    expect(toHiddenColumns(toVisibilityState(hidden))).toEqual(hidden)
  })
})
