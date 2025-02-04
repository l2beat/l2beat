import { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import type { BlockProvider, DaProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../../test/database'
import type { IndexerService } from '../../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../../tools/uif/ids'

import { LayerDaIndexer, type LayerDaIndexerDeps } from './LayerDaIndexer'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(LayerDaIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(LayerDaIndexer.prototype.update.name, () => {
    it('takes into account previous data bucket while aggregation', async () => {
      const projectId = ProjectId('ethereum')

      const daProvider = mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([
          {
            size: 100n,
            transaction: {
              blockTimestamp: START,
            },
          },
          {
            size: 200n,
            transaction: {
              blockTimestamp: START.add(1, 'hours'),
            },
          },
          {
            size: 300n,
            transaction: {
              blockTimestamp: START.add(2, 'hours'),
            },
          },
          // Next day
          {
            size: 10000n,
            transaction: {
              blockTimestamp: START.add(1, 'days'),
            },
          },
        ]),
      })

      // aggregated data from previous bucket
      const pastBucketRecords: DataAvailabilityRecord[] = [
        {
          projectId: projectId,
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
        projectId,
        db,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(newSafeHeight).toEqual(50)
      expect(daProvider.getBlobs).toHaveBeenCalledWith(0, 50)
      expect(repository.upsertMany).toHaveBeenCalledWith([
        {
          projectId: projectId,
          timestamp: START.toStartOf('day'),
          totalSize: 1600n, // 1000 + 100 + 200 + 300
        },
        {
          projectId: projectId,
          timestamp: START.add(1, 'days').toStartOf('day'),
          totalSize: 10000n,
        },
      ])
    })
  })
})

function createIndexer(deps?: Partial<LayerDaIndexerDeps>): LayerDaIndexer {
  return new LayerDaIndexer({
    name: 'test-layer-da-indexer',
    logger: Logger.SILENT,
    parents: [],
    daProvider:
      deps?.daProvider ??
      mockObject<DaProvider>({
        getBlobs: mockFn().resolvesTo([]),
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
    projectId: deps?.projectId ?? ProjectId('project'),
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    batchSize: 1,
    ...deps,
  })
}
