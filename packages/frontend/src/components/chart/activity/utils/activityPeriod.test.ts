import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  capTimeRange,
  formatActivityPeriod,
  getActivityPeriodEnd,
} from './activityPeriod'

const HOUR_START = UnixTime.toStartOf(UnixTime(1_800_000_000), 'hour')

describe(getActivityPeriodEnd.name, () => {
  it('ends a whole period after all its seconds', () => {
    expect(getActivityPeriodEnd(HOUR_START, 'hour', undefined)).toEqual(
      HOUR_START + 3600,
    )
    expect(getActivityPeriodEnd(HOUR_START, 'hour', HOUR_START + 7200)).toEqual(
      HOUR_START + 3600,
    )
  })

  it('ends a period under way with the newest block', () => {
    expect(getActivityPeriodEnd(HOUR_START, 'hour', HOUR_START + 899)).toEqual(
      HOUR_START + 900,
    )
  })
})

describe(formatActivityPeriod.name, () => {
  it('says a period under way is so far', () => {
    expect(
      formatActivityPeriod(HOUR_START, 'hour', HOUR_START + 900).endsWith(
        ' so far',
      ),
    ).toEqual(true)
    expect(
      formatActivityPeriod(HOUR_START, 'hour').endsWith(' so far'),
    ).toEqual(false)
  })
})

describe(capTimeRange.name, () => {
  it('ends with the newest block when the last period is under way', () => {
    expect(capTimeRange([0, 7200], 4000)).toEqual([0, 4001])
    expect(capTimeRange([0, 3600], 4000)).toEqual([0, 3600])
    expect(capTimeRange([0, 3600], undefined)).toEqual([0, 3600])
  })
})
