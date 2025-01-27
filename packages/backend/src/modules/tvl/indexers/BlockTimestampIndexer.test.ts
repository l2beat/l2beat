import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { Database } from '@l2beat/database'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { BlockTimestampProvider } from '../services/BlockTimestampProvider'
import type { SyncOptimizer } from '../utils/SyncOptimizer'
import { BlockTimestampIndexer } from './BlockTimestampIndexer'

describe(BlockTimestampIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockTimestampIndexer.prototype.update.name, () => {
    it('finds timestamp to sync and gets closest block', async () => {
      const from = 100
      const to = 300
      const timestampToSync = new UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestampToSync),
      })

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: async () => 666,
      })
      const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
        insert: async () => undefined,
      })

      const chain = 'ethereum'
      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [],
        blockTimestampProvider,
        indexerService: mockObject<IndexerService>({}),
        db: mockDatabase({ blockTimestamp: blockTimestampRepository }),
        chain,
        minHeight: 0,
        syncOptimizer,
      })

      const newSafeHeight = await indexer.update(from, to)

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenOnlyCalledWith(timestampToSync)

      expect(blockTimestampRepository.insert).toHaveBeenOnlyCalledWith({
        chain,
        timestamp: timestampToSync,
        blockNumber: 666,
      })

      expect(newSafeHeight).toEqual(timestampToSync.toNumber())
    })

    it('throws when fetched block number is smaller than previously fetched', async () => {
      const from = 100
      const to = 300
      const timestampToSync = new UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returns(timestampToSync),
      })

      const BLOCK_NUMBER = 123
      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: mockFn()
          .returnsOnce(123)
          .returnsOnce(BLOCK_NUMBER - 1),
      })
      const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
        insert: async () => undefined,
      })

      const chain = 'ethereum'
      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [],
        blockTimestampProvider,
        indexerService: mockObject<IndexerService>({}),
        db: mockDatabase({ blockTimestamp: blockTimestampRepository }),
        chain,
        minHeight: 0,
        syncOptimizer,
      })

      await indexer.update(from, to)
      await expect(async () => await indexer.update(from, to)).toBeRejectedWith(
        'Block number cannot be smaller',
      )
    })

    it('returns if optimized timestamp is later than to', async () => {
      const from = 100
      const to = 300
      const timestampToSync = new UnixTime(to + 100)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestampToSync),
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [],
        blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
        indexerService: mockObject<IndexerService>({}),
        db: mockDatabase({ blockTimestamp: mockObject() }),
        chain: 'chain',
        minHeight: 0,
        syncOptimizer,
      })

      const newSafeHeight = await indexer.update(from, to)

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(newSafeHeight).toEqual(to)
    })
  })

  describe(BlockTimestampIndexer.prototype.invalidate.name, () => {
    it('deletes records before targetHeight and returns the new safe height', async () => {
      const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
        deleteAfterExclusive: async () => 1,
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [],
        blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
        indexerService: mockObject<IndexerService>({}),
        db: mockDatabase({ blockTimestamp: blockTimestampRepository }),
        chain: 'ethereum',
        minHeight: 0,
        syncOptimizer: mockObject<SyncOptimizer>({}),
      })

      const targetHeight = 10
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(
        blockTimestampRepository.deleteAfterExclusive,
      ).toHaveBeenCalledWith('ethereum', new UnixTime(targetHeight))
      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})
