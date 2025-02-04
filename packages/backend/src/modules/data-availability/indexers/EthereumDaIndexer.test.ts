import { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import type { BlockProvider, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import {
  EthereumDaIndexer,
  type EthereumDaIndexerDeps,
} from './EthereumDaIndexer'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(EthereumDaIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(EthereumDaIndexer.prototype.update.name, () => {
    it('make update based on batchSize', async () => {
      const daProvider = mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([]),
      })

      const indexer = createIndexer({
        batchSize: 50,
        daProvider,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(newSafeHeight).toEqual(50)
      expect(daProvider.getBlobs).toHaveBeenCalledWith(0, 50)
    })

    it('takes into account previous data bucket while aggregation', async () => {
      const selector = 'ethereum'

      const daProvider = mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([
          {
            size: 100n,
            blockTimestamp: START,
          },
          {
            size: 200n,
            blockTimestamp: START.add(1, 'hours'),
          },
          {
            size: 300n,
            blockTimestamp: START.add(2, 'hours'),
          },
          // Next day
          {
            size: 10000n,
            blockTimestamp: START.add(1, 'days'),
          },
        ]),
      })

      // aggregated data from previous bucket
      const pastBucketRecords: DataAvailabilityRecord[] = [
        {
          projectId: selector,
          timestamp: START.toStartOf('day'),
          totalSize: 1000n,
        },
      ]

      const repository = mockObject<Database['dataAvailability']>({
        getByProjectIdAndFrom: mockFn().resolvesTo(pastBucketRecords),
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const db = mockObject<Database>({
        dataAvailability: repository,
      })

      const indexer = createIndexer({
        batchSize: 50,
        daProvider,
        selector,
        db,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(newSafeHeight).toEqual(50)
      expect(daProvider.getBlobs).toHaveBeenCalledWith(0, 50)
      expect(repository.upsertMany).toHaveBeenCalledWith([
        {
          projectId: selector,
          timestamp: START.toStartOf('day'),
          totalSize: 1600n, // 1000 + 100 + 200 + 300
        },
        {
          projectId: selector,
          timestamp: START.add(1, 'days').toStartOf('day'),
          totalSize: 10000n,
        },
      ])
    })
  })
})

function createIndexer(
  deps?: Partial<EthereumDaIndexerDeps>,
): EthereumDaIndexer {
  return new EthereumDaIndexer({
    logger: Logger.SILENT,
    parents: [],
    daProvider:
      deps?.daProvider ??
      mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([]),
        getBlobsByAddress: mockFn().resolvesTo([]),
      }),
    blockProvider:
      deps?.blockProvider ??
      mockObject<BlockProvider>({
        getBlockWithTransactions: mockFn().resolvesTo({
          timestamp: START.toNumber(),
        }),
      }),
    db: mockDatabase({
      dataAvailability: mockObject<Database['dataAvailability']>({
        getByProjectIdAndFrom: mockFn().resolvesTo([]),
        upsertMany: mockFn().resolvesTo(undefined),
      }),
    }),
    selector: deps?.selector ?? 'project',
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    batchSize: 1,
    ...deps,
  })
}
