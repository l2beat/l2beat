import { ActivityApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTpsWeeklyChange } from '../../../src/utils/activity/getTpsWeeklyChange'

const ONE_TPS = 24 * 60 * 60

describe(getTpsWeeklyChange.name, () => {
  it('calculates correctly for project', () => {
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

    const result = getTpsWeeklyChange(data, 'project')

    expect(result).toEqual('+100.00%')
  })

  it('calculates correctly for ethereum', () => {
    const data: ActivityApiChartPoint[] = [
      [new UnixTime(1), 2, ONE_TPS],
      [new UnixTime(2), 2, ONE_TPS],
      [new UnixTime(3), 2, ONE_TPS],
      [new UnixTime(4), 2, ONE_TPS],
      [new UnixTime(5), 2, ONE_TPS],
      [new UnixTime(6), 2, ONE_TPS],
      [new UnixTime(7), 2, ONE_TPS],
      [new UnixTime(8), 2, ONE_TPS * 2],
    ]

    const result = getTpsWeeklyChange(data, 'ethereum')

    expect(result).toEqual('+100.00%')
  })

  it('returns empty string if data is undefined', () => {
    const data = undefined

    const result = getTpsWeeklyChange(data, 'project')

    expect(result).toEqual('')
  })
  it('returns 0 if data array is too short', () => {
    const result = getTpsWeeklyChange(
      [[new UnixTime(1), ONE_TPS, 2]],
      'project',
    )

    expect(result).toEqual('+0.00%')
  })
})
