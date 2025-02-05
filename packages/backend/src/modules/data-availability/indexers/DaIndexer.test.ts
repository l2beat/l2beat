import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlobData, BlockProvider, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { DaIndexer, type DaIndexerDeps } from './DaIndexer'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(DaIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(DaIndexer.prototype.update.name, () => {
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
  })
})

class TestDaIndexer extends DaIndexer {
  protected override async process(
    _fillBackSince: UnixTime,
    _blobs: BlobData[],
  ): Promise<void> {
    return Promise.resolve()
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}

function createIndexer(deps?: Partial<DaIndexerDeps>): TestDaIndexer {
  return new TestDaIndexer({
    name: 'test-da-indexer',
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
    indexerService: mockObject<IndexerService>({}),
    minHeight: 0,
    batchSize: 1,
    ...deps,
  })
}
