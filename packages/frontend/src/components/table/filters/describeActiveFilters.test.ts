import { expect } from 'earl'
import { describeActiveFilters } from './describeActiveFilters'

describe(describeActiveFilters.name, () => {
  it('returns nothing when no filter is active', () => {
    expect(describeActiveFilters({})).toEqual(undefined)
  })

  it('skips filters left without values', () => {
    expect(describeActiveFilters({ stack: { values: [] } })).toEqual(undefined)
  })

  it('names each filter with the operator shown in the filter chip', () => {
    expect(
      describeActiveFilters({
        stack: { values: ['OP Stack', 'Arbitrum'] },
        stage: { values: ['Stage 0'], inversed: true },
        daLayer: { values: ['Ethereum'] },
      }),
    ).toEqual(
      'Filtered by Stack is any of OP Stack, Arbitrum; Stage is not Stage 0; DA Layer is Ethereum',
    )
  })
})
