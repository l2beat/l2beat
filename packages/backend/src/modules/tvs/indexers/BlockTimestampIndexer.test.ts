import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import type { BlockTimestampConfig } from '../types'
import { BlockTimestampIndexer } from './BlockTimestampIndexer'

describe(BlockTimestampIndexer.name, () => {
  describe(BlockTimestampIndexer.prototype.multiUpdate.name, () => {
    it('fetches block number for timestamp and saves it to DB', async () => {
      const from = 100
      const to = 300
      const timestampToSync = UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestampToSync),
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn().returnsOnce(666),
      })

      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        blockTimestampProvider,
        db: mockDatabase({ tvsBlockTimestamp: tvsBlockTimestampRepository }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenOnlyCalledWith(timestampToSync, 'ethereum')

      expect(tvsBlockTimestampRepository.insertMany).toHaveBeenOnlyCalledWith([
        {
          configurationId: config('config-1', 'ethereum').id,
          chain: 'ethereum',
          timestamp: timestampToSync,
          blockNumber: 666,
        },
      ])

      expect(safeHeight).toEqual(timestampToSync)
    })

    it('returns to value if timestamp is out of range', async () => {
      const from = 100
      const to = 300
      const timestampToSync = UnixTime(400) // Greater than 'to'
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestampToSync),
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
        db: mockDatabase({ tvsBlockTimestamp: mockObject() }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)
      expect(safeHeight).toEqual(to)
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const from = 100
      const to = 300
      const timestampToSync = UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returns(timestampToSync),
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn()
          .returnsOnce(BLOCK_NUMBER)
          .returnsOnce(BLOCK_NUMBER - 1),
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        blockTimestampProvider,
        db: mockDatabase({ tvsBlockTimestamp: mockObject() }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')])
      await expect(
        async () =>
          await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')]),
      ).toBeRejectedWith('Block number cannot be smaller')
    })
  })

  describe(BlockTimestampIndexer.prototype.removeData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        deleteByConfigInTimeRange: mockFn().returnsOnce(3).returnsOnce(2),
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        configurations: [config('config-1', 'ethereum')],
        blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
        db: mockDatabase({ tvsBlockTimestamp: tvsBlockTimestampRepository }),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const removalConfigs = [
        {
          id: 'config-1',
          from: 100,
          to: 200,
        },
        {
          id: 'config-2',
          from: 300,
          to: 400,
        },
      ]

      await indexer.removeData(removalConfigs)

      expect(
        tvsBlockTimestampRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].from),
        UnixTime(removalConfigs[0].to),
      )

      expect(
        tvsBlockTimestampRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].from),
        UnixTime(removalConfigs[1].to),
      )
    })
  })

  it('throws if more than one configuration is provided', () => {
    const syncOptimizer = mockObject<SyncOptimizer>({})
    const blockTimestampProvider = mockObject<BlockTimestampProvider>({})

    expect(
      () =>
        new BlockTimestampIndexer({
          logger: Logger.SILENT,
          configurations: [
            config('config-1', 'ethereum'),
            config('config-1', 'ethereum'),
          ], // Two configs
          blockTimestampProvider,
          db: mockDatabase(),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        }),
    ).toThrow('This indexer should take only one configuration')
  })

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function config(
  id: string,
  chain: string,
): Configuration<BlockTimestampConfig> {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      chainName: chain,
      configurationId: id,
      sinceTimestamp: UnixTime(0),
    },
  }
}
