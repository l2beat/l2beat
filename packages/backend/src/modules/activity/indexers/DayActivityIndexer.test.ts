import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { DayActivityIndexer } from './DayActivityIndexer'
import type { DayActivityIndexerDeps, TxsCountService } from './types'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(DayActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(DayActivityIndexer.prototype.update.name, () => {
    it('make update based on batchSize', async () => {
      const txsCountService = mockObject<TxsCountService>({
        getTxsCount: mockFn().resolvesTo([]),
      })

      const indexer = createIndexer({
        txsCountService,
        batchSize: 50,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(txsCountService.getTxsCount).toHaveBeenCalledWith(0, 50)
      expect(newSafeHeight).toEqual(50)
    })

    it('make update based on batchSize and uncertaintyBuffer', async () => {
      const txsCountService = mockObject<TxsCountService>({
        getTxsCount: mockFn().resolvesTo([]),
      })

      const indexer = createIndexer({
        txsCountService,
        batchSize: 50,
        uncertaintyBuffer: 10,
      })

      const newSafeHeight = await indexer.update(50, 100)

      expect(txsCountService.getTxsCount).toHaveBeenCalledWith(39, 89)
      expect(newSafeHeight).toEqual(89)
    })

    it('gets blocks counts, saves to db and updates sync metadata', async () => {
      const activityRepository = mockObject<Database['activity']>({
        upsertMany: mockFn().resolvesTo(undefined),
      })
      const syncMetadataRepository = mockObject<Database['syncMetadata']>({
        updateSyncedUntil: mockFn().resolvesTo(undefined),
      })
      const mockActivityRecords = [
        activityRecord('a', START, 5),
        activityRecord('a', START + 1 * UnixTime.DAY, 4),
        activityRecord('a', START + 2 * UnixTime.DAY, 2),
      ]

      const txsCountService = mockObject<TxsCountService>({
        getTxsCount: mockFn().resolvesTo({
          records: mockActivityRecords,
          latestTimestamp:
            mockActivityRecords[mockActivityRecords.length - 1].timestamp,
        }),
      })

      const indexer = createIndexer({
        txsCountService,
        db: mockDatabase({
          activity: activityRepository,
          syncMetadata: syncMetadataRepository,
        }),
        batchSize: 100,
      })

      const newSafeHeight = await indexer.update(0, 10)

      expect(txsCountService.getTxsCount).toHaveBeenCalledWith(0, 10)
      expect(activityRepository.upsertMany).toHaveBeenCalledWith(
        mockActivityRecords,
      )
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenCalledWith(
        'activity',
        ['a'],
        10 * UnixTime.DAY,
      )
      expect(newSafeHeight).toEqual(10)
    })
  })

  describe(DayActivityIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight', async () => {
      const indexer = createIndexer()

      const targetHeight = 0
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null = null,
): any {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount,
    start: UnixTime.toStartOf(timestamp, 'day'),
    end: UnixTime.toEndOf(timestamp, 'day') - 1,
  }
}

function createIndexer(
  deps?: Partial<DayActivityIndexerDeps>,
): DayActivityIndexer {
  return new DayActivityIndexer({
    logger: Logger.SILENT,
    parents: [],
    txsCountService: mockObject<TxsCountService>({
      getTxsCount: mockFn().resolvesTo([]),
    }),
    db: mockDatabase({
      activity: mockObject<Database['activity']>({
        getByProjectAndTimeRange: mockFn().resolvesTo([]),
        upsertMany: mockFn().resolvesTo(undefined),
      }),
      syncMetadata: mockObject<Database['syncMetadata']>({
        updateSyncedUntil: mockFn().resolvesTo(undefined),
      }),
    }),
    projectId: ProjectId('a'),
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    batchSize: 1,
    uncertaintyBuffer: 0,
    ...deps,
  })
}
