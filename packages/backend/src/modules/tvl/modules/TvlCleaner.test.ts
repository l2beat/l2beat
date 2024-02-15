import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { Clock } from '../../../tools/Clock'
import { TvlCleaner } from './TvlCleaner'

describe(TvlCleaner.name, () => {
  describe(TvlCleaner.prototype.start.name, () => {
    it('schedules on every hour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        _TVL_ONLY_getHourlyDeletionBoundary: () => UnixTime.ZERO,
        _TVL_ONLY_getSixHourlyDeletionBoundary: () => UnixTime.ZERO,
      })
      const mockRepository = mockObject<TvlCleanerRepository>()
      const tvlCleaner = new TvlCleaner(
        clock,
        Logger.SILENT,
        mockRepository,
        [],
      )

      tvlCleaner.start()

      await waitForExpect(() => {
        expect(clock.onNewHour).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe(TvlCleaner.prototype.clean.name, () => {
    it('gets boundaries, iterates over tables and deletes', async () => {
      const hourlyDeletionBoundary = UnixTime.fromDate(
        new Date('2024-02-05T06:00:00Z'),
      )
      const sixHourlyDeletionBoundary = UnixTime.fromDate(
        new Date('2024-01-05T06:00:00Z'),
      )
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        _TVL_ONLY_getHourlyDeletionBoundary: () => hourlyDeletionBoundary,
        _TVL_ONLY_getSixHourlyDeletionBoundary: () => sixHourlyDeletionBoundary,
      })

      const firstTable = mockObject({
        constructor: { name: 'firstTableRepository' },
        deleteHourlyUntil: (_: { from: UnixTime | undefined; to: UnixTime }) =>
          Promise.resolve(1),
        deleteSixHourlyUntil: (_: {
          from: UnixTime | undefined
          to: UnixTime
        }) => Promise.resolve(2),
      })
      const secondTable = mockObject({
        constructor: { name: 'secondTableRepository' },
        deleteHourlyUntil: (_: { from: UnixTime | undefined; to: UnixTime }) =>
          Promise.resolve(1),
        deleteSixHourlyUntil: (_: {
          from: UnixTime | undefined
          to: UnixTime
        }) => Promise.resolve(2),
      })

      const firstTableHourlyCleanedUntil = UnixTime.fromDate(
        new Date('2024-02-03T06:00:00Z'),
      )
      const firstTableSixHourlyCleanedUntil = UnixTime.fromDate(
        new Date('2024-01-03T06:00:00Z'),
      )
      const repository = mockObject<TvlCleanerRepository>({
        find: mockFn()
          .given(firstTable.constructor.name)
          .resolvesToOnce({
            repositoryName: firstTable.constructor.name,
            hourlyCleanedUntil: firstTableHourlyCleanedUntil,
            sixHourlyCleanedUntil: firstTableSixHourlyCleanedUntil,
          })
          .given(secondTable.constructor.name)
          .resolvesToOnce(undefined),
        addOrUpdate: mockFn().resolvesTo(1),
      })

      const tvlCleaner = new TvlCleaner(clock, Logger.SILENT, repository, [
        firstTable,
        secondTable,
      ])

      await tvlCleaner.clean()

      expect(repository.find).toHaveBeenNthCalledWith(
        1,
        firstTable.constructor.name,
      )
      expect(firstTable.deleteHourlyUntil).toHaveBeenCalledWith({
        from: firstTableHourlyCleanedUntil,
        to: hourlyDeletionBoundary,
      })
      expect(firstTable.deleteSixHourlyUntil).toHaveBeenCalledWith({
        from: firstTableSixHourlyCleanedUntil,
        to: sixHourlyDeletionBoundary,
      })
      expect(repository.addOrUpdate).toHaveBeenNthCalledWith(1, {
        repositoryName: firstTable.constructor.name,
        hourlyCleanedUntil: hourlyDeletionBoundary,
        sixHourlyCleanedUntil: sixHourlyDeletionBoundary,
      })
      expect(repository.find).toHaveBeenNthCalledWith(
        2,
        secondTable.constructor.name,
      )
      expect(secondTable.deleteHourlyUntil).toHaveBeenCalledWith({
        from: undefined,
        to: hourlyDeletionBoundary,
      })
      expect(secondTable.deleteSixHourlyUntil).toHaveBeenCalledWith({
        from: undefined,
        to: sixHourlyDeletionBoundary,
      })
      expect(repository.addOrUpdate).toHaveBeenNthCalledWith(2, {
        repositoryName: secondTable.constructor.name,
        hourlyCleanedUntil: hourlyDeletionBoundary,
        sixHourlyCleanedUntil: sixHourlyDeletionBoundary,
      })
    })

    it('skips if hourly and six hourly was already cleared', async () => {
      const hourlyDeletionBoundary = new UnixTime(1000)
      const sixHourlyDeletionBoundary = new UnixTime(2000)
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        _TVL_ONLY_getHourlyDeletionBoundary: () => hourlyDeletionBoundary,
        _TVL_ONLY_getSixHourlyDeletionBoundary: () => sixHourlyDeletionBoundary,
      })

      const firstTable = mockObject({
        constructor: { name: 'firstTableRepository' },
        deleteHourlyUntil: mockFn(),
        deleteSixHourlyUntil: mockFn(),
      })

      const repository = mockObject<TvlCleanerRepository>({
        find: mockFn().resolvesTo({
          repositoryName: firstTable.constructor.name,
          hourlyCleanedUntil: hourlyDeletionBoundary,
          sixHourlyCleanedUntil: sixHourlyDeletionBoundary,
        }),
        addOrUpdate: mockFn().resolvesTo(1),
      })

      const tvlCleaner = new TvlCleaner(clock, Logger.SILENT, repository, [
        firstTable,
      ])

      await tvlCleaner.clean()

      expect(repository.find).toHaveBeenNthCalledWith(
        1,
        firstTable.constructor.name,
      )
      expect(firstTable.deleteHourlyUntil).not.toHaveBeenCalled()
      expect(firstTable.deleteSixHourlyUntil).not.toHaveBeenCalled()
      expect(repository.addOrUpdate).not.toHaveBeenCalled()
    })
  })
})
