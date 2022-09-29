import { ActivityApiChartPoint, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getTransactionWeeklyCount } from '../../../src/utils/activity/getTransactionWeeklyCount'

const ONE_TPS = 24 * 60 * 60

describe(getTransactionWeeklyCount.name, () => {
  it('calculates correctly', () => {
    const data: ActivityApiChartPoint[] = [
      [new UnixTime(1), ONE_TPS],
      [new UnixTime(2), ONE_TPS],
      [new UnixTime(3), ONE_TPS],
      [new UnixTime(4), ONE_TPS],
      [new UnixTime(5), ONE_TPS],
      [new UnixTime(6), ONE_TPS],
      [new UnixTime(7), ONE_TPS * 2],
    ]

    const result = getTransactionWeeklyCount(data)

    expect(result).toEqual(8 * ONE_TPS)
  })
  it('returns undefined if data is undefined', () => {
    const data = undefined

    const result = getTransactionWeeklyCount(data)

    expect(result).toEqual(undefined)
  })
  it('returns undefined if data array is too short', () => {
    const result = getTransactionWeeklyCount([[new UnixTime(1), ONE_TPS]])

    expect(result).toEqual(undefined)
  })
})
