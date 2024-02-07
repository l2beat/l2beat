import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { Clock } from '../../core/Clock'
import { TvlCleaner } from './TvlCleaner'

describe(TvlCleaner.name, () => {
  describe(TvlCleaner.prototype.start.name, () => {
    it('schedules on every hour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        _TVL_ONLY_getHourlyDeletionBoundary: () => UnixTime.ZERO,
        _TVL_ONLY_getSixHourlyDeletionBoundary: () => UnixTime.ZERO,
      })
      const tvlCleaner = new TvlCleaner(clock, Logger.SILENT, [])

      tvlCleaner.start()

      await waitForExpect(() => {
        expect(clock.onNewHour).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe(TvlCleaner.prototype.clean.name, () => {
    it('gets boundaries, iterates over tables and deletes', async () => {
      const hourlyDeletionBoundary = new UnixTime(1000)
      const sixHourlyDeletionBoundary = new UnixTime(2000)
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        _TVL_ONLY_getHourlyDeletionBoundary: () => hourlyDeletionBoundary,
        _TVL_ONLY_getSixHourlyDeletionBoundary: () => sixHourlyDeletionBoundary,
      })
      const firstTable = mockObject({
        deleteHourlyUntil: (_: UnixTime) => Promise.resolve(1),
        deleteSixHourlyUntil: (_: UnixTime) => Promise.resolve(2),
      })
      const secondTable = mockObject({
        deleteHourlyUntil: (_: UnixTime) => Promise.resolve(1),
        deleteSixHourlyUntil: (_: UnixTime) => Promise.resolve(2),
      })
      const tvlCleaner = new TvlCleaner(clock, Logger.SILENT, [
        firstTable,
        secondTable,
      ])

      await tvlCleaner.clean()

      expect(firstTable.deleteHourlyUntil).toHaveBeenCalledWith(
        hourlyDeletionBoundary,
      )
      expect(firstTable.deleteSixHourlyUntil).toHaveBeenCalledWith(
        sixHourlyDeletionBoundary,
      )
      expect(secondTable.deleteHourlyUntil).toHaveBeenCalledWith(
        hourlyDeletionBoundary,
      )
      expect(secondTable.deleteSixHourlyUntil).toHaveBeenCalledWith(
        sixHourlyDeletionBoundary,
      )
    })
  })
})
