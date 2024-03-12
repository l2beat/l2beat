import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Clock } from '../../tools/Clock'
import { SyncService } from './SyncService'

describe(SyncService.name, () => {
  describe(SyncService.prototype.getTimestampToSync.name, () => {
    it('takes minTimestamp into consideration', () => {
      const minTimestamp = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))

      const options = {
        minTimestamp,
        removeHourlyAfterDays: 0,
        removeSixHourlyAfterDays: 0,
      }

      const clock = mockObject<Clock>({
        getLastHour: () => minTimestamp.add(1, 'hours'),
      })

      const syncService = new SyncService(clock, options)

      const timestamp = minTimestamp.add(-1, 'days')
      const timestampToSync = syncService.getTimestampToSync(timestamp)
      const expected = options.minTimestamp

      expect(timestampToSync).toEqual(expected)
    })

    it('minTimestamp is recursively returned to take cutoffs into consideration', () => {
      const minTimestamp = UnixTime.fromDate(new Date('2023-05-01T01:00:00Z'))

      const options = {
        minTimestamp,
        removeHourlyAfterDays: 0,
        removeSixHourlyAfterDays: 0,
      }

      const clock = mockObject<Clock>({
        getLastHour: () => minTimestamp.add(365, 'days'),
      })

      const syncService = new SyncService(clock, options)

      const timestamp = minTimestamp.add(-1, 'days')
      const timestampToSync = syncService.getTimestampToSync(timestamp)
      const expected = options.minTimestamp.toEndOf('day')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns daily timestamp when old enough', () => {
      const minTimestamp = UnixTime.fromDate(new Date('2023-05-01T01:00:00Z'))

      const options = {
        minTimestamp,
        removeHourlyAfterDays: 10,
        removeSixHourlyAfterDays: 93,
      }

      const lastHour = minTimestamp.add(365, 'days')
      const clock = mockObject<Clock>({
        getLastHour: () => lastHour,
      })

      const syncService = new SyncService(clock, options)

      const timestamp = lastHour.add(-180, 'days').add(1, 'hours')
      const timestampToSync = syncService.getTimestampToSync(timestamp)
      const expected = timestamp.toEndOf('day')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns six hourly timestamp when old enough', () => {
      const minTimestamp = UnixTime.fromDate(new Date('2023-05-01T01:00:00Z'))

      const options = {
        minTimestamp,
        removeHourlyAfterDays: 10,
        removeSixHourlyAfterDays: 93,
      }

      const lastHour = minTimestamp.add(365, 'days')

      const clock = mockObject<Clock>({
        getLastHour: () => lastHour,
      })

      const syncService = new SyncService(clock, options)

      const timestamp = lastHour.add(-90, 'days').add(3, 'hours')
      const timestampToSync = syncService.getTimestampToSync(timestamp)
      const expected = timestamp.toEndOf('six hours')

      expect(timestampToSync).toEqual(expected)
    })

    it('returns hourly timestamp when old enough', () => {
      const minTimestamp = UnixTime.fromDate(new Date('2023-05-01T01:00:00Z'))

      const options = {
        minTimestamp,
        removeHourlyAfterDays: 10,
        removeSixHourlyAfterDays: 93,
      }

      const lastHour = minTimestamp.add(365, 'days')

      const clock = mockObject<Clock>({
        getLastHour: () => lastHour,
      })

      const syncService = new SyncService(clock, options)

      const timestamp = lastHour.add(-5, 'days').add(2, 'hours')
      const timestampToSync = syncService.getTimestampToSync(timestamp)
      const expected = timestamp

      expect(timestampToSync).toEqual(expected)
    })
  })
})
