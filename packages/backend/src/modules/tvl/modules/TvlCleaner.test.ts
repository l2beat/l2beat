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
      const hourlyDeletionBoundary = new UnixTime(1000)
      const sixHourlyDeletionBoundary = new UnixTime(2000)
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
        _TVL_ONLY_getHourlyDeletionBoundary: () => hourlyDeletionBoundary,
        _TVL_ONLY_getSixHourlyDeletionBoundary: () => sixHourlyDeletionBoundary,
      })

      const firstTable = mockObject({
        constructor: { name: 'firstTableRepository' },
        deleteHourlyUntil: (_: UnixTime, __: UnixTime | undefined) =>
          Promise.resolve(1),
        deleteSixHourlyUntil: (_: UnixTime, __: UnixTime | undefined) =>
          Promise.resolve(2),
      })
      const secondTable = mockObject({
        constructor: { name: 'secondTableRepository' },
        deleteHourlyUntil: (_: UnixTime, __: UnixTime | undefined) =>
          Promise.resolve(1),
        deleteSixHourlyUntil: (_: UnixTime, __: UnixTime | undefined) =>
          Promise.resolve(2),
      })

      const firstTableCleanedUntil = UnixTime.fromDate(new Date('2022-02-13'))
      const repository = mockObject<TvlCleanerRepository>({
        find: mockFn()
          .given(firstTable.constructor.name)
          .resolvesToOnce({
            repositoryName: firstTable.constructor.name,
            cleanedUntil: firstTableCleanedUntil,
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
      expect(firstTable.deleteHourlyUntil).toHaveBeenCalledWith(
        hourlyDeletionBoundary,
        firstTableCleanedUntil,
      )
      expect(firstTable.deleteSixHourlyUntil).toHaveBeenCalledWith(
        sixHourlyDeletionBoundary,
        firstTableCleanedUntil,
      )
      expect(repository.addOrUpdate).toHaveBeenNthCalledWith(1, {
        repositoryName: firstTable.constructor.name,
        cleanedUntil: hourlyDeletionBoundary,
      })
      expect(repository.find).toHaveBeenNthCalledWith(
        2,
        secondTable.constructor.name,
      )
      expect(secondTable.deleteHourlyUntil).toHaveBeenCalledWith(
        hourlyDeletionBoundary,
        undefined,
      )
      expect(secondTable.deleteSixHourlyUntil).toHaveBeenCalledWith(
        sixHourlyDeletionBoundary,
        undefined,
      )
      expect(repository.addOrUpdate).toHaveBeenNthCalledWith(2, {
        repositoryName: secondTable.constructor.name,
        cleanedUntil: hourlyDeletionBoundary,
      })
    })

    it('skips if was already cleared in the last hour', async () => {
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
          cleanedUntil: hourlyDeletionBoundary,
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
