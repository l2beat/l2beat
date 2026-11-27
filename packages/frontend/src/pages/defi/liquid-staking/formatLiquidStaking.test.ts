import { expect } from 'earl'
import { formatDays } from './formatLiquidStaking'

describe(formatDays.name, () => {
  it('reads a year or more as 365+', () => {
    expect(formatDays(364.96)).toEqual('365 days')
    expect(formatDays(365)).toEqual('365+ days')
    expect(formatDays(46_745)).toEqual('365+ days')
  })
})
