import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import {
  BlockTimestampIndexer,
  BlockTimestampProvider,
} from './BlockTimestampIndexer'

describe(BlockTimestampIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockTimestampIndexer.prototype.update.name, () => {
    it('finds timestamp to sync and gets closest block', async () => {
      const from = UnixTime.fromDate(new Date('2021-01-01T21:00:00Z'))
      const to = from.add(1, 'days')

      const blockTimestampProvider = mockObject<BlockTimestampProvider>({
        getBlockNumberAtOrBefore: async () => 666,
      })

      const blockTimestampRepository = mockObject<BlockTimestampRepository>({
        add: async () => '',
      })

      const timestampToSync = from.toEndOf('day')

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestampToSync), // 21:00
      })

      const chain = 'ethereum'

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [mockObject<HourlyIndexer>({ subscribe: () => {} })],
        blockTimestampProvider,
        indexerService: mockObject<IndexerService>({}),
        blockTimestampRepository,
        chain,
        minHeight: 0,
        syncOptimizer,
      })

      const newSafeHeight = await indexer.update(from.toNumber(), to.toNumber())

      expect(
        blockTimestampProvider.getBlockNumberAtOrBefore,
      ).toHaveBeenOnlyCalledWith(timestampToSync)

      expect(blockTimestampRepository.add).toHaveBeenOnlyCalledWith({
        chain,
        timestamp: timestampToSync,
        blockNumber: 666,
      })

      expect(newSafeHeight).toEqual(timestampToSync.toNumber())
    })
  })

  describe(BlockTimestampIndexer.prototype.invalidate.name, () => {
    it('deletes records before targetHeight and returns the new safe height', async () => {
      const blockTimestampRepository = mockObject<BlockTimestampRepository>({
        deleteAfterExclusive: async () => 1,
      })

      const indexer = new BlockTimestampIndexer({
        logger: Logger.SILENT,
        parents: [mockObject<HourlyIndexer>({ subscribe: () => {} })],
        blockTimestampProvider: mockObject<BlockTimestampProvider>({}),
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
