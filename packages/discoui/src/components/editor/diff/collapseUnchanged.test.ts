import { expect } from 'earl'
import { collapsibleRegions } from './collapseUnchanged'

describe('collapsibleRegions', () => {
  it('hides a whole text without changes', () => {
    expect(collapsibleRegions([], [], 10, 10)).toEqual([
      region([1, 11], [1, 11]),
    ])
  })

  it('keeps three lines of context around a change', () => {
    const change = mapping([20, 21], [20, 22])
    expect(collapsibleRegions([change], [], 40, 41)).toEqual([
      region([1, 17], [1, 17]),
      region([24, 41], [25, 42]),
    ])
  })

  it('counts context only in lines level on both sides', () => {
    // Three comment lines on the right are filtered out right before the
    // change, so the context above it is three lines on each side plus them.
    const filtered = mapping([20, 20], [20, 23])
    const change = mapping([20, 21], [23, 24])
    expect(collapsibleRegions([change], [filtered], 30, 33)).toEqual([
      region([1, 17], [1, 17]),
      region([24, 31], [27, 34]),
    ])
  })

  it('shows a filtered change at the end of the hidden part whole', () => {
    // Hiding lines 1-9 on both sides would leave the right side's padding
    // for the filtered lines below the bar, so they stay shown.
    const filtered = mapping([10, 10], [10, 12])
    const change = mapping([13, 14], [15, 16])
    expect(collapsibleRegions([change], [filtered], 13, 15)).toEqual([
      region([1, 10], [1, 10]),
    ])
  })
})

function region(original: [number, number], modified: [number, number]) {
  return mapping(original, modified)
}

function mapping(original: [number, number], modified: [number, number]) {
  return {
    original: {
      startLineNumber: original[0],
      endLineNumberExclusive: original[1],
    },
    modified: {
      startLineNumber: modified[0],
      endLineNumberExclusive: modified[1],
    },
  }
}
