import { expect } from 'earl'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import {
  decodeFilterables,
  encodeFilterables,
  getL2TabsIndex,
  parseL2Tab,
} from './lazyL2Tabs'

// Method: the encoding exists only to shrink the SSR data, so the property
// that matters is that decoding gives back what the filters would have seen
// on the full entries, including entries with no filterable values at all.
describe(encodeFilterables.name, () => {
  const entries: Record<
    'rollups' | 'validiumsAndOptimiums' | 'others',
    FilterableEntry[]
  > = {
    rollups: [
      {
        filterable: [
          { id: 'stack', value: 'OP Stack' },
          { id: 'stage', value: 'Stage 1' },
        ],
      },
      { filterable: [{ id: 'stack', value: 'OP Stack' }] },
    ],
    validiumsAndOptimiums: [],
    others: [{ filterable: undefined }, { filterable: [] }],
  }

  it('round-trips every tab through decodeFilterables', () => {
    expect(decodeFilterables(encodeFilterables(entries))).toEqual(entries)
  })

  it('stores each distinct value once', () => {
    expect(encodeFilterables(entries).values).toEqual([
      { id: 'stack', value: 'OP Stack' },
      { id: 'stage', value: 'Stage 1' },
    ])
  })
})

describe(getL2TabsIndex.name, () => {
  it('keeps every entry row count', () => {
    const entry = (name: string) => ({ name, filterable: undefined })
    const index = getL2TabsIndex(
      {
        rollups: [entry('a')],
        validiumsAndOptimiums: [entry('b')],
        others: [entry('c'), entry('d')],
      },
      (e) => (e.name === 'd' ? 2 : 1),
    )

    expect(index.filterables.tabs.rollups).toEqual([null])
    expect(index.rowCounts).toEqual({
      rollups: [1],
      validiumsAndOptimiums: [1],
      others: [1, 2],
    })
  })
})

describe(parseL2Tab.name, () => {
  it('accepts known tabs and falls back to rollups', () => {
    expect(parseL2Tab('others')).toEqual('others')
    expect(parseL2Tab(undefined)).toEqual('rollups')
    expect(parseL2Tab('nope')).toEqual('rollups')
    expect(parseL2Tab(['others', 'rollups'])).toEqual('rollups')
  })
})
