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
        LAST_HOUR - 1 * UnixTime.HOUR,
      )
      expect(result).toEqual(true)
    })

    it('return false if timestamp should not be synced', () => {
      const result = syncOptimizer.shouldTimestampBeSynced(
        LAST_HOUR + 365 * UnixTime.DAY - 1 * UnixTime.HOUR,
      )
      expect(result).toEqual(true)
    })
  })

  describe(SyncOptimizer.prototype.getTimestampToSync.name, () => {
    const CLOCK = mockObject<Clock>({
      getLastHour: () => LAST_HOUR + 1 * UnixTime.MINUTE,
      hourlyCutoffDays: 7,
      sixHourlyCutoffDays: 90,
    })

    it('returns daily timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp =
        LAST_HOUR -
        (SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD + 1) * UnixTime.DAY +
        1 * UnixTime.HOUR
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
        (HOURLY_CUTOFF_WITH_GRACE_PERIOD + 1) * UnixTime.DAY +
        1 * UnixTime.HOUR

      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case sixHourly should be returned
      const expected = UnixTime.toEndOf(hourlyTimestamp, 'six hours')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR - 1 * UnixTime.HOUR
      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case daily should be returned
      const expected = UnixTime.toEndOf(LAST_HOUR - 1 * UnixTime.HOUR, 'hour')

      expect(timestampToSync).toEqual(expected)
    })
  })

  describe(SyncOptimizer.prototype.getTimestampsToSync.name, () => {
    it('respects maxTimestamps', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - 7 * UnixTime.HOUR
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start,
        start + 100_000 * UnixTime.DAY,
        7,
      )

      expect(timestampToSync).toEqual([
        start,
        start + 1 * UnixTime.HOUR,
        start + 2 * UnixTime.HOUR,
        start + 3 * UnixTime.HOUR,
        start + 4 * UnixTime.HOUR,
        start + 5 * UnixTime.HOUR,
        start + 6 * UnixTime.HOUR,
      ])
    })

    it('respects to', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start = LAST_HOUR - 7 * UnixTime.HOUR
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start,
        start + 6 * UnixTime.HOUR,
        100_000,
      )

      expect(timestampToSync).toEqual([
        start,
        start + 1 * UnixTime.HOUR,
        start + 2 * UnixTime.HOUR,
        start + 3 * UnixTime.HOUR,
        start + 4 * UnixTime.HOUR,
        start + 5 * UnixTime.HOUR,
        start + 6 * UnixTime.HOUR,
      ])
    })

    it('complex case', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK)

      const start =
        LAST_HOUR - (SIX_HOURLY_CUTOFF_WITH_GRACE_PERIOD + 2) * UnixTime.DAY
      const timestampToSync = syncOptimizer.getTimestampsToSync(
        start,
        start + 100_000 * UnixTime.DAY,
        7,
      )

      expect(timestampToSync).toEqual([
        start,
        start + 1 * UnixTime.DAY,
        start + 2 * UnixTime.DAY,
        start + 2 * UnixTime.DAY + 6 * UnixTime.HOUR,
        start + 2 * UnixTime.DAY + 12 * UnixTime.HOUR,
        start + 2 * UnixTime.DAY + 18 * UnixTime.HOUR,
        start + 2 * UnixTime.DAY + 24 * UnixTime.HOUR,
      ])
    })
  })
})
