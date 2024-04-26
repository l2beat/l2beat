import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Clock } from '../../../tools/Clock'
import { SyncOptimizer } from './SyncOptimizer'

describe(SyncOptimizer.name, () => {
  describe(SyncOptimizer.prototype.getTimestampToSync.name, () => {
    const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T01:01:01Z'))
    const SIX_HOURLY_CUTOFF = 10
    const DAILY_CUTOFF = 93
    const OPTIONS = {
      removeHourlyAfterDays: SIX_HOURLY_CUTOFF,
      removeSixHourlyAfterDays: DAILY_CUTOFF,
    }
    const LAST_HOUR = MIN_TIMESTAMP.add(365, 'days')
    const CLOCK = mockObject<Clock>({
      getLastHour: () => LAST_HOUR,
    })

    it('returns daily timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK, OPTIONS)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(-(DAILY_CUTOFF + 1), 'days').add(
        1,
        'hours',
      )
      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case daily should be returned
      const expected = hourlyTimestamp.toEndOf('day')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns six hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK, OPTIONS)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(
        -(SIX_HOURLY_CUTOFF + 1),
        'days',
      ).add(1, 'hours')

      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case sixHourly should be returned
      const expected = hourlyTimestamp.toEndOf('six hours')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns hourly timestamp', () => {
      const syncOptimizer = new SyncOptimizer(CLOCK, OPTIONS)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(-1, 'hours')
      const timestampToSync = syncOptimizer.getTimestampToSync(hourlyTimestamp)
      // in this case daily should be returned
      const expected = LAST_HOUR.add(-1, 'hours').toEndOf('hour')

      expect(timestampToSync).toEqual(expected)
    })
  })

  describe(SyncOptimizer.prototype.shouldTimestampBeSynced.name, () => {
    const now = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

    const clock = mockObject<Clock>({
      getLastHour: () => now,
    })

    const syncOptimizer = new SyncOptimizer(clock, {
      removeHourlyAfterDays: 10,
      removeSixHourlyAfterDays: 93,
    })
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
})
