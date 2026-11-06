import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  capTimeRange,
  getActivityPeriodSeconds,
} from './getActivityPeriodSeconds'

describe(getActivityPeriodSeconds.name, () => {
  const HOUR_START = UnixTime.toStartOf(UnixTime(1_800_000_000), 'hour')

  it('spreads a whole period over all its seconds', () => {
    expect(getActivityPeriodSeconds(HOUR_START, 'hour', undefined)).toEqual(
      3600,
    )
    expect(
      getActivityPeriodSeconds(HOUR_START, 'hour', HOUR_START + 7200),
    ).toEqual(3600)
  })

  it('spreads a period under way up to the newest block', () => {
    expect(
      getActivityPeriodSeconds(HOUR_START, 'hour', HOUR_START + 899),
    ).toEqual(900)
  })
})

describe(capTimeRange.name, () => {
  it('ends with the newest block when the last period is under way', () => {
    expect(capTimeRange([0, 7200], 4000)).toEqual([0, 4001])
    expect(capTimeRange([0, 3600], 4000)).toEqual([0, 3600])
    expect(capTimeRange([0, 3600], undefined)).toEqual([0, 3600])
  })
})
