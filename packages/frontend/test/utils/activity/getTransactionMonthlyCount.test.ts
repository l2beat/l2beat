import { ActivityApiChartPoint, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getTransactionMonthlyCount } from '../../../src/utils/activity/getTransactionWeeklyCount'

const ONE_TPS = 24 * 60 * 60

describe(getTransactionMonthlyCount.name, () => {
  it('calculates correctly', () => {
    const data: ActivityApiChartPoint[] = new Array(50).fill([
      new UnixTime(0),
      ONE_TPS,
    ])

    const result = getTransactionMonthlyCount(data)

    expect(result).toEqual(30 * ONE_TPS)
  })
  it('returns undefined if data is undefined', () => {
    const data = undefined

    const result = getTransactionMonthlyCount(data)

    expect(result).toEqual(undefined)
  })
  it('counts as much as it can if the data is too short', () => {
    const result = getTransactionMonthlyCount([[new UnixTime(1), ONE_TPS]])

    expect(result).toEqual(ONE_TPS)
  })
})
