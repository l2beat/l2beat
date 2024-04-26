import { ActivityApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getTransactionCount } from '../../../src/utils/activity/getTransactionCount'

const ONE_TPS = 24 * 60 * 60

describe(getTransactionCount.name, () => {
  it('calculates month correctly', () => {
    const data: ActivityApiChartPoint[] = new Array(50).fill([
      new UnixTime(0),
      ONE_TPS,
      ONE_TPS * 2,
    ])

    const result = getTransactionCount(data, 'project', 30)

    expect(result).toEqual(30 * ONE_TPS)
  })
  it('calculates week correctly', () => {
    const data: ActivityApiChartPoint[] = new Array(50).fill([
      new UnixTime(0),
      ONE_TPS,
      ONE_TPS * 2,
    ])

    const result = getTransactionCount(data, 'project', 7)

    expect(result).toEqual(7 * ONE_TPS)
  })

  it('counts as much as it can if the data is too short', () => {
    const result = getTransactionCount(
      [[new UnixTime(1), ONE_TPS, ONE_TPS * 2]],
      'project',
      30,
    )

    expect(result).toEqual(ONE_TPS)
  })

  it('counts ethereum data', () => {
    const data: ActivityApiChartPoint[] = new Array(50).fill([
      new UnixTime(0),
      ONE_TPS,
      ONE_TPS * 2,
    ])

    const result = getTransactionCount(data, 'ethereum', 30)

    expect(result).toEqual(30 * ONE_TPS * 2)
  })

  it('throws if the days is less than 1', () => {
    expect(() => getTransactionCount([], 'project', 0.99)).toThrow(
      'Days must be at least 1',
    )
  })
})
