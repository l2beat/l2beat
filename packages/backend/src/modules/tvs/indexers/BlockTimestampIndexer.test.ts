import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
        getTimestampToSync: vi.fn().mockReturnValueOnce(timestampToSync),
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: vi.fn().mockReturnValueOnce(666),
      })

      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        upsertMany: vi.fn().mockReturnValueOnce(undefined),
      })

      const indexer = new BlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider,
          db: mockDatabase({ tvsBlockTimestamp: tvsBlockTimestampRepository }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenCalledExactlyOnceWith(
        from,
      )

      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenCalledExactlyOnceWith(timestampToSync, 'ethereum')

      expect(
        tvsBlockTimestampRepository.upsertMany,
      ).toHaveBeenCalledExactlyOnceWith([
        {
          configurationId: config('config-1', 'ethereum').id,
          chain: 'ethereum',
          timestamp: timestampToSync,
          blockNumber: 666,
        },
      ])

      expect(safeHeight).toStrictEqual(timestampToSync)
    })

    it('returns to value if timestamp is out of range', async () => {
      const from = 100
      const to = 300
      const timestampToSync = UnixTime(400) // Greater than 'to'
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: vi.fn().mockReturnValueOnce(timestampToSync),
      })

      const indexer = new BlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
          db: mockDatabase({ tvsBlockTimestamp: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const updateFn = await indexer.multiUpdate(from, to, [
        config('config-1', 'ethereum'),
      ])
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenCalledExactlyOnceWith(
        from,
      )
      expect(safeHeight).toStrictEqual(to)
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const from = 100
      const to = 300
      const timestampToSync = UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: vi.fn().mockReturnValue(timestampToSync),
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: vi
          .fn()
          .mockReturnValueOnce(BLOCK_NUMBER)
          .mockReturnValueOnce(BLOCK_NUMBER - 1),
      })

      const indexer = new BlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider,
          db: mockDatabase({ tvsBlockTimestamp: mockObject() }),
          syncOptimizer,
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')])
      await expect(
        async () =>
          await indexer.multiUpdate(from, to, [config('config-1', 'ethereum')]),
      ).rejects.toThrow('Block number cannot be smaller')
    })
  })

  describe(BlockTimestampIndexer.prototype.trimData.name, () => {
    it('deletes records for configurations in time range', async () => {
      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        deleteByConfigInTimeRange: vi
          .fn()
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(2),
      })

      const indexer = new BlockTimestampIndexer(
        {
          configurations: [config('config-1', 'ethereum')],
          blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
          db: mockDatabase({ tvsBlockTimestamp: tvsBlockTimestampRepository }),
          syncOptimizer: mockObject<SyncOptimizer>({}),
          parents: [],
          indexerService: mockObject<IndexerService>({}),
        },
        Logger.SILENT,
      )

      const removalConfigs = [
        {
          type: 'trim' as const,
          id: 'config-1',
          range: [100, 200] as [number, number],
        },
        {
          type: 'trim' as const,
          id: 'config-2',
          range: [300, 400] as [number, number],
        },
      ]

      await indexer.trimData(removalConfigs)

      expect(
        tvsBlockTimestampRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].range[0]),
        UnixTime(removalConfigs[0].range[1]),
      )

      expect(
        tvsBlockTimestampRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].range[0]),
        UnixTime(removalConfigs[1].range[1]),
      )
    })
  })

  it('throws if more than one configuration is provided', () => {
    const syncOptimizer = mockObject<SyncOptimizer>({})
    const blockTimestampProvider = mockObject<BlockTimestampProvider>({})

    expect(
      () =>
        new BlockTimestampIndexer(
          {
            configurations: [
              config('config-1', 'ethereum'),
              config('config-1', 'ethereum'),
            ], // Two configs
            blockTimestampProvider,
            db: mockDatabase(),
            syncOptimizer,
            parents: [],
            indexerService: mockObject<IndexerService>({}),
          },
          Logger.SILENT,
        ),
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
