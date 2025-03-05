import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { Clock } from '../../../tools/Clock'
import { SyncOptimizer } from './SyncOptimizer'

describe(SyncOptimizer.name, () => {
  const LAST_HOUR = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
  const HOURLY_CUTOFF_WITH_GRACE_PERIOD = 10
  const SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD = 93
  const CLOCK = mockObject<Clock>({
    getLastHour: () => LAST_HOUR,
    hourlyCutoffDays: 7,
    sixHourlyCutoffDays: 90,
  })

  describe(SyncOptimizer.prototype.shouldTimestampBeSynced.name, () => {
    const syncOptimizer = new SyncOptimizer(CLOCK)
    it('return true if timestamp should be synced', () => {
      const result = syncOptimizer.shouldTimestampBeSynced(
        LAST_HOUR - UnixTime(1, 'hours'),
      )
      expect(result).toEqual(true)
    })

    it('return false if timestamp should not be synced', () => {
      const result = syncOptimizer.shouldTimestampBeSynced(
        LAST_HOUR + UnixTime(365, 'days') - UnixTime(1, 'hours'),
      )
      expect(result).toEqual(true)
    })
  })

  describe(SyncOptimizer.prototype.getTimestampToSync.name, () => {
    const CLOCK = mockObject<Clock>({
      getLastHour: () => LAST_HOUR + UnixTime(1, 'minutes'),
      hourlyCutoffDays: 7,
      sixHourlyCutoffDays: 90,
    })

    it('returns daily timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp =
        LAST_HOUR -
        UnixTime(SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD + 1, 'days') +
        UnixTime(1, 'hours')
      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case daily should be returned
      const expected = UnixTime.toEndOf(hourlyTimestamp, 'day')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns six hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp =
        LAST_HOUR -
        UnixTime(HOURLY_CUTOFF_WITH_GRACE_PERIOD + 1, 'days') +
        UnixTime(1, 'hours')

      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case sixHourly should be returned
      const expected = UnixTime.toEndOf(hourlyTimestamp, 'six hours')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR - UnixTime(1, 'hours')
      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case daily should be returned
      const expected = UnixTime.toEndOf(
        LAST_HOUR - UnixTime(1, 'hours'),
        'hour',
      )

      expect(timestampToSync).toEqual(expected)
    })
  })

  describe(SyncOptimizer.prototype.getTimestampsToSync.name, () => {
    it('respects maxTimestamps', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - UnixTime(7, 'hours')
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start,
        start + UnixTime(100_000, 'days'),
        7,
      )

      expect(timestampToSync).toEqual([
        start,
        start + UnixTime(1, 'hours'),
        start + UnixTime(2, 'hours'),
        start + UnixTime(3, 'hours'),
        start + UnixTime(4, 'hours'),
        start + UnixTime(5, 'hours'),
        start + UnixTime(6, 'hours'),
      ])
    })

    it('respects to', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - UnixTime(7, 'hours')
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start,
        start + UnixTime(6, 'hours'),
        100_000,
      )

      expect(timestampToSync).toEqual([
        start,
        start + UnixTime(1, 'hours'),
        start + UnixTime(2, 'hours'),
        start + UnixTime(3, 'hours'),
        start + UnixTime(4, 'hours'),
        start + UnixTime(5, 'hours'),
        start + UnixTime(6, 'hours'),
      ])
    })

    it('complex case', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start =
        LAST_HOUR - UnixTime(SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD + 2, 'days')
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start,
        start + UnixTime(100_000, 'days'),
        7,
      )

      expect(timestampToSync).toEqual([
        start,
        start + UnixTime(1, 'days'),
        start + UnixTime(2, 'days'),
        start + UnixTime(2, 'days') + UnixTime(6, 'hours'),
        start + UnixTime(2, 'days') + UnixTime(12, 'hours'),
        start + UnixTime(2, 'days') + UnixTime(18, 'hours'),
        start + UnixTime(2, 'days') + UnixTime(24, 'hours'),
      ])
    })
  })
})
