import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'
import type { Clock } from '../../../tools/Clock'
import type { SyncOptimizer } from './SyncOptimizer'
import { TvlCleaner } from './TvlCleaner'

describe(TvlCleaner.name, () => {
  describe(TvlCleaner.prototype.start.name, () => {
    it('schedules on every hour', async () => {
      const clock = mockObject<Clock>({
        onNewHour: () => () => {},
      })
      const mockSyncOptimizer = mockObject<SyncOptimizer>({
        hourlyCutOffWithGracePeriod: UnixTime.ZERO,
        sixHourlyCutOffWithGracePeriod: UnixTime.ZERO,
      })
      const mockRepository = mockObject<Database['tvlCleaner']>()
      const tvlCleaner = new TvlCleaner(
        clock,
        Logger.SILENT,
        mockSyncOptimizer,
        mockObject<Database>({ tvlCleaner: mockRepository }),
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
      })
      const mockSyncOptimizer = mockObject<SyncOptimizer>({
        hourlyCutOffWithGracePeriod: hourlyDeletionBoundary,
        sixHourlyCutOffWithGracePeriod: sixHourlyDeletionBoundary,
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
      const repository = mockObject<Database['tvlCleaner']>({
        findByRepositoryName: mockFn()
          .given(firstTable.constructor.name)
          .resolvesToOnce({
            repositoryName: firstTable.constructor.name,
            hourlyCleanedUntil: firstTableHourlyCleanedUntil,
            sixHourlyCleanedUntil: firstTableSixHourlyCleanedUntil,
          })
          .given(secondTable.constructor.name)
          .resolvesToOnce(undefined),
        upsert: mockFn().resolvesTo(1),
      })

      const tvlCleaner = new TvlCleaner(
        clock,
        Logger.SILENT,
        mockSyncOptimizer,
        mockObject<Database>({ tvlCleaner: repository }),
        [firstTable, secondTable],
      )

      await tvlCleaner.clean()

      expect(repository.findByRepositoryName).toHaveBeenNthCalledWith(
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
      expect(repository.upsert).toHaveBeenNthCalledWith(1, {
        repositoryName: firstTable.constructor.name,
        hourlyCleanedUntil: hourlyDeletionBoundary,
        sixHourlyCleanedUntil: sixHourlyDeletionBoundary,
      })
      expect(repository.findByRepositoryName).toHaveBeenNthCalledWith(
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
      expect(repository.upsert).toHaveBeenNthCalledWith(2, {
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
      })
      const mockSyncOptimizer = mockObject<SyncOptimizer>({
        hourlyCutOffWithGracePeriod: hourlyDeletionBoundary,
        sixHourlyCutOffWithGracePeriod: sixHourlyDeletionBoundary,
      })

      const firstTable = mockObject({
        constructor: { name: 'firstTableRepository' },
        deleteHourlyUntil: mockFn(),
        deleteSixHourlyUntil: mockFn(),
      })

      const repository = mockObject<Database['tvlCleaner']>({
        findByRepositoryName: mockFn().resolvesTo({
          repositoryName: firstTable.constructor.name,
          hourlyCleanedUntil: hourlyDeletionBoundary,
          sixHourlyCleanedUntil: sixHourlyDeletionBoundary,
        }),
        upsert: mockFn().resolvesTo(1),
      })

      const tvlCleaner = new TvlCleaner(
        clock,
        Logger.SILENT,
        mockSyncOptimizer,
        mockObject<Database>({ tvlCleaner: repository }),
        [firstTable],
      )

      await tvlCleaner.clean()

      expect(repository.findByRepositoryName).toHaveBeenNthCalledWith(
        1,
        firstTable.constructor.name,
      )
      expect(firstTable.deleteHourlyUntil).not.toHaveBeenCalled()
      expect(firstTable.deleteSixHourlyUntil).not.toHaveBeenCalled()
      expect(repository.upsert).not.toHaveBeenCalled()
    })
  })
})
