import { ActivityApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTransactionCount } from '../../../src/utils/activity/getTransactionCount'

const ONE_TPS = 24 * 60 * 60

describe(getTransactionCount.name, () => {
  it('calculates month correctly', () => {
    const data: ActivityApiChartPoint[] = new Array(50).fill([
      new UnixTime(0),
      ONE_TPS,
    ])

    const result = getTransactionCount(data, 'month')

    expect(result).toEqual(30 * ONE_TPS)
  })
  it('calculates week correctly', () => {
    const data: ActivityApiChartPoint[] = new Array(50).fill([
      new UnixTime(0),
      ONE_TPS,
    ])

    const result = getTransactionCount(data, 'week')

    expect(result).toEqual(7 * ONE_TPS)
  })
  it('returns undefined if data is undefined', () => {
    const data = undefined

    const result = getTransactionCount(data, 'month')

    expect(result).toEqual(undefined)
  })
  it('counts as much as it can if the data is too short', () => {
    const result = getTransactionCount([[new UnixTime(1), ONE_TPS]], 'month')

    expect(result).toEqual(ONE_TPS)
  })
})
