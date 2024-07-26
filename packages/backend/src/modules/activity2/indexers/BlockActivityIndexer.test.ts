import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BaseTxsCountProvider } from '../services/BaseTxsCountProvider'
import { BlockActivityIndexer } from './BlockActivityIndexer'
import { ActivityIndexerDeps } from './types'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(BlockActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockActivityIndexer.prototype.update.name, () => {
    it('make update based on batchSize', async () => {
      const txsCountProvider = mockObject<BaseTxsCountProvider>({
        getTxsCount: mockFn().resolvesTo([]),
      })

      const indexer = createIndexer({
        txsCountProvider,
        batchSize: 50,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(txsCountProvider.getTxsCount).toHaveBeenCalledWith(0, 50)
      expect(newSafeHeight).toEqual(50)
    })

    it('gets blocks counts, sum with current counts and saves to db', async () => {
      const activityRepository = mockObject<Database['activity']>({
        getByProjectAndTimeRange: mockFn().resolvesTo([
          activityRecord('a', START, 7, 0, 8),
          activityRecord('a', START.add(1, 'days'), 3, 11, 13),
        ]),
        addOrUpdateMany: mockFn().resolvesTo(undefined),
      })

      const txsCountProvider = mockObject<BaseTxsCountProvider>({
        getTxsCount: mockFn().resolvesTo([
          activityRecord('a', START, 5, 9, 10),
          activityRecord('a', START.add(1, 'days'), 4, 13, 15),
          activityRecord('a', START.add(2, 'days'), 2, 16, 20),
        ]),
      })

      const indexer = createIndexer({
        txsCountProvider,
        db: mockDatabase({ activity: activityRepository }),
        batchSize: 100,
      })

      const newSafeHeight = await indexer.update(0, 10)

      expect(txsCountProvider.getTxsCount).toHaveBeenCalledWith(0, 10)
      expect(activityRepository.addOrUpdateMany).toHaveBeenCalledWith([
        activityRecord('a', START, 12, 0, 10),
        activityRecord('a', START.add(1, 'days'), 7, 11, 15),
        activityRecord('a', START.add(2, 'days'), 2, 16, 20),
      ])
      expect(newSafeHeight).toEqual(10)
    })
  })

  describe(BlockActivityIndexer.prototype.getDatabaseEntries.name, () => {
    it('return an empty map if there are no records', async () => {
      const indexer = createIndexer()

      const entries = await indexer.getDatabaseEntries([])

      expect(entries).toEqual(new Map())
    })

    it('returns a map of timestamps to records', async () => {
      const mockActivityRecords = [
        activityRecord('a', START, 1),
        activityRecord('a', START.add(1, 'days'), 2),
        activityRecord('a', START.add(2, 'days'), 4),
      ]

      const activityRepository = mockObject<Database['activity']>({
        getByProjectAndTimeRange: mockFn().resolvesTo(mockActivityRecords),
      })

      const indexer = createIndexer({
        db: mockDatabase({ activity: activityRepository }),
        batchSize: 100,
      })

      const entries = await indexer.getDatabaseEntries([
        activityRecord('a', START.add(2, 'days'), 4),
        activityRecord('a', START.add(1, 'hours'), 4),
        activityRecord('a', START, 1),
      ])

      // finds min and max timestamp
      expect(
        activityRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(1, ProjectId('a'), [
        START,
        START.add(2, 'days'),
      ])

      // returns a map of timestamps to counts
      expect(entries).toEqual(
        new Map([
          [START.toNumber(), mockActivityRecords[0]],
          [START.add(1, 'days').toNumber(), mockActivityRecords[1]],
          [START.add(2, 'days').toNumber(), mockActivityRecords[2]],
        ]),
      )
    })
  })

  describe(BlockActivityIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight', async () => {
      const indexer = createIndexer()

      const targetHeight = 0
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(newSafeHeight).toEqual(targetHeight)
    })

    it('throws assertion when targetHeight different than safeHeight', async () => {
      const indexer = createIndexer()

      const targetHeight = 10

      expect(async () => await indexer.invalidate(targetHeight)).toBeRejected()
    })
  })
})

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  start: number = 0,
  end: number = 0,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    start,
    end,
  }
}

function createIndexer(
  deps?: Partial<ActivityIndexerDeps>,
): BlockActivityIndexer {
  return new BlockActivityIndexer({
    logger: Logger.SILENT,
    parents: [],
    txsCountProvider: mockObject<BaseTxsCountProvider>({
      getTxsCount: mockFn().resolvesTo([]),
    }),
    db: mockDatabase({
      activity: mockObject<Database['activity']>({
        getByProjectAndTimeRange: mockFn().resolvesTo([]),
        addOrUpdateMany: mockFn().resolvesTo(undefined),
      }),
    }),
    projectId: ProjectId('a'),
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    batchSize: 1,
    ...deps,
  })
}
