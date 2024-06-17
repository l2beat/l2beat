import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { BlockTimestampService } from '../services/BlockTimestampService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
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

      const blockTimestampService = mockObject<BlockTimestampService>({
        getBlockNumberAtOrBefore: async () => 666,
      })
      const blockTimestampRepository = mockObject<BlockTimestampRepository>({
        add: async () => '',
      })

      const chain = 'ethereum'
      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [],
        blockTimestampService,
        indexerService: mockObject<IndexerService>({}),
        blockTimestampRepository,
        chain,
        minHeight: 0,
        syncOptimizer,
      })

      const newSafeHeight = await indexer.update(from, to)

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(
        blockTimestampService.getBlockNumberAtOrBefore,
      ).toHaveBeenOnlyCalledWith(timestampToSync)

      expect(blockTimestampRepository.add).toHaveBeenOnlyCalledWith({
        chain,
        timestamp: timestampToSync,
        blockNumber: 666,
      })

      expect(newSafeHeight).toEqual(timestampToSync.toNumber())
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
        blockTimestampService: mockObject<BlockTimestampService>({}),
        indexerService: mockObject<IndexerService>({}),
        blockTimestampRepository: mockObject<BlockTimestampRepository>({}),
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
      const blockTimestampRepository = mockObject<BlockTimestampRepository>({
        deleteAfterExclusive: async () => 1,
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [],
        blockTimestampService: mockObject<BlockTimestampService>({}),
        indexerService: mockObject<IndexerService>({}),
        blockTimestampRepository,
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
