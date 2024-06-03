import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Clock } from '../../../tools/Clock'
import { SyncOptimizer } from './SyncOptimizer'

describe(SyncOptimizer.name, () => {
  describe(SyncOptimizer.prototype.shouldTimestampBeSynced.name, () => {
    const now = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

    const clock = mockObject<Clock>({
      getLastHour: () => now,
    })

    const syncOptimizer = new SyncOptimizer(clock)
    it('return true if timestamp should be synced', () => {
      const result = syncOptimizer.shouldTimestampBeSynced(now.add(-1, 'hours'))
      expect(result).toEqual(true)
    })

    it('return false if timestamp should not be synced', () => {
      const result = syncOptimizer.shouldTimestampBeSynced(
        now.add(365, 'days').add(-1, 'hours'),
      )
      expect(result).toEqual(true)
    })
  })
  describe(SyncOptimizer.prototype.getTimestampToSync.name, () => {
    const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T01:01:01Z'))
    const SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD = 10
    const DAILY_CUTOFF_WITH_GRACE_PERIOD = 93
    const LAST_HOUR = MIN_TIMESTAMP.add(365, 'days')
    const CLOCK = mockObject<Clock>({
      getLastHour: () => LAST_HOUR,
    })

    it('returns daily timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(
        -(DAILY_CUTOFF_WITH_GRACE_PERIOD + 1),
        'days',
      ).add(1, 'hours')
      const timestampToSync = syncOptimizer.getTimestampToSync(
        hourlyTimestamp.toNumber(),
      )
      // in this case daily should be returned
      const expected = hourlyTimestamp.toEndOf('day')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns six hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(
        -(SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD + 1),
        'days',
      ).add(1, 'hours')

      const timestampToSync = syncOptimizer.getTimestampToSync(
        hourlyTimestamp.toNumber(),
      )
      // in this case sixHourly should be returned
      const expected = hourlyTimestamp.toEndOf('six hours')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(-1, 'hours')
      const timestampToSync = syncOptimizer.getTimestampToSync(
        hourlyTimestamp.toNumber(),
      )
      // in this case daily should be returned
      const expected = LAST_HOUR.add(-1, 'hours').toEndOf('hour')

      expect(timestampToSync).toEqual(expected)
    })
  })

  describe(SyncOptimizer.prototype.getTimestampsToSync.name, () => {
    const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

    const LAST_HOUR = MIN_TIMESTAMP.add(365, 'days')
    const CLOCK = mockObject<Clock>({
      getLastHour: () => LAST_HOUR,
    })

    it('respects maxTimestamps', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK, OPTIONS)

      const start = LAST_HOUR.add(-7, 'hours')
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start.toNumber(),
        start.add(365, 'days').toNumber(),
        7,
      )

      expect(timestampToSync).toEqual([
        start,
        start.add(1, 'hours'),
        start.add(2, 'hours'),
        start.add(3, 'hours'),
        start.add(4, 'hours'),
        start.add(5, 'hours'),
        start.add(6, 'hours'),
      ])
    })

    it('respects to', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK, OPTIONS)

      const start = LAST_HOUR.add(-7, 'hours')
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start.toNumber(),
        start.add(6, 'hours').toNumber(),
        1000,
      )

      expect(timestampToSync).toEqual([
        start,
        start.add(1, 'hours'),
        start.add(2, 'hours'),
        start.add(3, 'hours'),
        start.add(4, 'hours'),
        start.add(5, 'hours'),
        start.add(6, 'hours'),
      ])
    })

    it('complex case', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK, OPTIONS)

      const start = LAST_HOUR.add(-(DAILY_CUTOFF + 2), 'days')
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start.toNumber(),
        start.add(365, 'days').toNumber(),
        7,
      )

      expect(timestampToSync).toEqual([
        start,
        start.add(1, 'days'),
        start.add(2, 'days'),
        start.add(2, 'days').add(6, 'hours'),
        start.add(2, 'days').add(12, 'hours'),
        start.add(2, 'days').add(18, 'hours'),
        start.add(2, 'days').add(24, 'hours'),
      ])
    })
  })
})
