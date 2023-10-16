import { ActivityApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTpsWeeklyChange } from '../../../src/utils/activity/getTpsWeeklyChange'

const ONE_TPS = 24 * 60 * 60

describe(getTpsWeeklyChange.name, () => {
  it('calculates correctly', () => {
    const data: ActivityApiChartPoint[] = [
      [new UnixTime(1), ONE_TPS, 2],
      [new UnixTime(2), ONE_TPS, 2],
      [new UnixTime(3), ONE_TPS, 2],
      [new UnixTime(4), ONE_TPS, 2],
      [new UnixTime(5), ONE_TPS, 2],
      [new UnixTime(6), ONE_TPS, 2],
      [new UnixTime(7), ONE_TPS, 2],
      [new UnixTime(8), ONE_TPS * 2, 2],
    ]

    const result = getTpsWeeklyChange(data)

    expect(result).toEqual('+100.00%')
  })
  it('returns empty string if data is undefined', () => {
    const data = undefined

    const result = getTpsWeeklyChange(data)

    expect(result).toEqual('')
  })
  it('returns 0 if data array is too short', () => {
    const result = getTpsWeeklyChange([[new UnixTime(1), ONE_TPS, 2]])

    expect(result).toEqual('+0.00%')
  })
})
