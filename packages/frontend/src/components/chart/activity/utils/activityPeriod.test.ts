import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { capTimeRange, getActivityPeriod } from './activityPeriod'

describe(getActivityPeriod.name, () => {
  const HOUR_START = UnixTime.toStartOf(UnixTime(1_800_000_000), 'hour')

  it('spreads a whole period over all its seconds', () => {
    expect(getActivityPeriod(HOUR_START, 'hour', undefined)).toEqual({
      seconds: 3600,
      underWay: false,
    })
    expect(getActivityPeriod(HOUR_START, 'hour', HOUR_START + 7200)).toEqual({
      seconds: 3600,
      underWay: false,
    })
  })

  it('spreads a period under way up to the newest block', () => {
    expect(getActivityPeriod(HOUR_START, 'hour', HOUR_START + 899)).toEqual({
      seconds: 900,
      underWay: true,
    })
  })
})

describe(capTimeRange.name, () => {
  it('ends with the newest block when the last period is under way', () => {
    expect(capTimeRange([0, 7200], 4000)).toEqual([0, 4001])
    expect(capTimeRange([0, 3600], 4000)).toEqual([0, 3600])
    expect(capTimeRange([0, 3600], undefined)).toEqual([0, 3600])
  })
})
