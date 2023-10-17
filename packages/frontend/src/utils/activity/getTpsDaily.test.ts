import { ActivityApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTpsDaily } from '../../../src/utils/activity/getTpsDaily'

const ONE_TPS = 24 * 60 * 60

describe(getTpsDaily.name, () => {
  it('calculates correctly for project', () => {
    const data: ActivityApiChartPoint[] = [
      [new UnixTime(0), 0, 5],
      [new UnixTime(1), 1, 4],
      [new UnixTime(2), ONE_TPS, 2],
    ]

    const result = getTpsDaily(data, 'project')

    expect(result).toEqual(1)
  })

  it('calculates correctly for ethereum', () => {
    const data: ActivityApiChartPoint[] = [
      [new UnixTime(0), 0, 5],
      [new UnixTime(1), 1, 4],
      [new UnixTime(2), ONE_TPS, ONE_TPS * 2],
    ]

    const result = getTpsDaily(data, 'ethereum')

    expect(result).toEqual(2)
  })

  it('returns undefined if data not defined', () => {
    const data = undefined

    const result = getTpsDaily(data, 'project')

    expect(result).toEqual(undefined)
  })
  it('returns undefined if data is empty', () => {
    const result = getTpsDaily([], 'project')

    expect(result).toEqual(undefined)
  })
})
