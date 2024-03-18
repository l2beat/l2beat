import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Clock } from '../../tools/Clock'
import { SyncService } from './SyncService'

describe(SyncService.name, () => {
  describe(SyncService.prototype.getTimestampToSync.name, () => {
    const MIN_TIMESTAMP = UnixTime.fromDate(new Date('2023-05-01T01:01:01Z'))
    const SIX_HOURLY_CUTOFF = 10
    const DAILY_CUTOFF = 93
    const OPTIONS = {
      chainsMinTimestamp: { ethereum: MIN_TIMESTAMP },
      removeHourlyAfterDays: SIX_HOURLY_CUTOFF,
      removeSixHourlyAfterDays: DAILY_CUTOFF,
    }
    const LAST_HOUR = MIN_TIMESTAMP.add(365, 'days')
    const CLOCK = mockObject<Clock>({
      getLastHour: () => LAST_HOUR,
    })

    it('returns daily timestamp', () => {
      const syncService = new SyncService(CLOCK, OPTIONS)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(-(DAILY_CUTOFF + 1), 'days').add(
        1,
        'hours',
      )
      const timestampToSync = syncService.getTimestampToSync(
        'ethereum',
        hourlyTimestamp,
        'from',
      )
      // in this case daily should be returned
      const expected = hourlyTimestamp.toEndOf('day')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns six hourly timestamp', () => {
      const syncService = new SyncService(CLOCK, OPTIONS)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(
        -(SIX_HOURLY_CUTOFF + 1),
        'days',
      ).add(1, 'hours')

      const timestampToSync = syncService.getTimestampToSync(
        'ethereum',
        hourlyTimestamp,
        'from',
      )
      // in this case sixHourly should be returned
      const expected = hourlyTimestamp.toEndOf('six hours')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns hourly timestamp', () => {
      const syncService = new SyncService(CLOCK, OPTIONS)

      // hourly timestamp older than daily cutoff
      const hourlyTimestamp = LAST_HOUR.add(-1, 'hours')
      const timestampToSync = syncService.getTimestampToSync(
        'ethereum',
        hourlyTimestamp,
        'from',
      )
      // in this case daily should be returned
      const expected = LAST_HOUR.add(-1, 'hours').toEndOf('hour')

      expect(timestampToSync).toEqual(expected)
    })

    it('takes minTimestamp into consideration', () => {
      const syncService = new SyncService(CLOCK, OPTIONS)

      const timestamp = MIN_TIMESTAMP.add(-1, 'days')
      const timestampToSync = syncService.getTimestampToSync(
        'ethereum',
        timestamp,
        'from',
      )
      const expected = MIN_TIMESTAMP.toEndOf('day')

      expect(timestampToSync).toEqual(expected)
    })

    it('takes boundary type into consideration', () => {
      const syncService = new SyncService(CLOCK, OPTIONS)

      const timestamp = LAST_HOUR.add(-1, 'hours')

      const fromTimestamp = syncService.getTimestampToSync(
        'ethereum',
        timestamp,
        'from',
      )
      const expected = LAST_HOUR.add(-1, 'hours').toEndOf('hour')

      expect(fromTimestamp).toEqual(expected)

      const toTimestamp = syncService.getTimestampToSync(
        'ethereum',
        timestamp,
        'to',
      )
      const expected2 = LAST_HOUR.add(-1, 'hours').toStartOf('hour')

      expect(toTimestamp).toEqual(expected2)
    })
  })

  describe(SyncService.prototype.shouldTimestampBeSynced.name, () => {
    const now = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

    const clock = mockObject<Clock>({
      getLastHour: () => now,
    })

    const syncService = new SyncService(clock, {
      chainsMinTimestamp: { ethereum: UnixTime.ZERO },
      removeHourlyAfterDays: 10,
      removeSixHourlyAfterDays: 93,
    })
    it('return true if timestamp should be synced', () => {
      const result = syncService.shouldTimestampBeSynced(
        'ethereum',
        now.add(-1, 'hours'),
      )
      expect(result).toEqual(true)
    })

    it('return false if timestamp should not be synced', () => {
      const result = syncService.shouldTimestampBeSynced(
        'ethereum',
        now.add(365, 'days').add(-1, 'hours'),
      )
      expect(result).toEqual(true)
    })
  })
})
