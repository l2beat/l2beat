import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import {
  BlockTimestampIndexer,
  BlockTimestampProvider,
} from './BlockTimestampIndexer'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { SyncOptimizer } from './SyncOptimizer'

describe(BlockTimestampIndexer.name, () => {
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

      const syncOptimizer = mockObject<SyncOptimizer>({
        shouldTimestampBeSynced: mockFn()
          .returnsOnce(false) // 21:00
          .returnsOnce(false) // 22:00
          .returnsOnce(false) // 23:00
          .returnsOnce(true), // 00:00
      })

      const chain = 'ethereum'
      const indexer = new BlockTimestampIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        blockTimestampProvider,
        mockObject<IndexerStateRepository>({}),
        blockTimestampRepository,
        chain,
        UnixTime.ZERO,
        syncOptimizer,
      )

      const newSafeHeight = await indexer.update(from.toNumber(), to.toNumber())

      const timestampToSync = from.toEndOf('day')

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

  describe(BlockTimestampIndexer.prototype.initialize.name, () => {
    it('initializes state when not initialized', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: mockFn().resolvesToOnce(undefined).resolvesToOnce({}),
        add: async () => '',
      })

      const minTimestamp = UnixTime.ZERO
      const indexer = new BlockTimestampIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<BlockTimestampProvider>({}),
        stateRepository,
        mockObject<BlockTimestampRepository>({}),
        'ethereum',
        minTimestamp,
        mockObject<SyncOptimizer>({}),
      )

      await indexer.initialize()

      expect(stateRepository.add).toHaveBeenCalledWith({
        indexerId: indexer.indexerId,
        safeHeight: minTimestamp.toNumber() - 1,
        minTimestamp: minTimestamp,
      })
    })

    it('throw when there is an intent to change minTimestamp', async () => {
      const minTimestampBefore = UnixTime.ZERO

      const indexerState = {
        indexerId: 'indexer',
        safeHeight: 1,
        minTimestamp: minTimestampBefore,
      }

      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => {
          return indexerState
        },
      })

      const minTimestamp = minTimestampBefore.add(1, 'days')
      const indexer = new BlockTimestampIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<BlockTimestampProvider>({}),
        stateRepository,
        mockObject<BlockTimestampRepository>({}),
        'ethereum',
        minTimestamp,
        mockObject<SyncOptimizer>({}),
      )

      await expect(() => indexer.initialize()).toBeRejectedWith(
        'Minimum timestamp of this indexer cannot be updated',
      )
    })
  })

  describe(BlockTimestampIndexer.prototype.getSafeHeight.name, () => {
    it('return state from DB', async () => {
      const safeHeight = 1
      const stateRepository = mockObject<IndexerStateRepository>({
        findIndexerState: async () => {
          return {
            indexerId: 'indexer',
            safeHeight,
            minTimestamp: UnixTime.ZERO,
          }
        },
      })

      const indexer = new BlockTimestampIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<BlockTimestampProvider>({}),
        stateRepository,
        mockObject<BlockTimestampRepository>({}),
        'ethereum',
        UnixTime.ZERO,
        mockObject<SyncOptimizer>({}),
      )

      const result = await indexer.getSafeHeight()

      expect(result).toEqual(safeHeight)
      expect(stateRepository.findIndexerState).toHaveBeenCalledWith(
        indexer.indexerId,
      )
    })
  })

  describe(BlockTimestampIndexer.prototype.setSafeHeight.name, () => {
    it('save minTimestamp if safeHeight is before minTimestamp', async () => {
      const stateRepository = mockObject<IndexerStateRepository>({
        setSafeHeight: async () => 1,
      })

      const indexer = new BlockTimestampIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<BlockTimestampProvider>({}),
        stateRepository,
        mockObject<BlockTimestampRepository>({}),
        'ethereum',
        UnixTime.ZERO,
        mockObject<SyncOptimizer>({}),
      )

      const safeHeight = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const trx = mockObject<Knex.Transaction>()
      await indexer.setSafeHeight(safeHeight.toNumber(), trx)

      expect(stateRepository.setSafeHeight).toHaveBeenCalledWith(
        indexer.indexerId,
        safeHeight.toNumber(),
        trx,
      )
    })
  })

  describe(BlockTimestampIndexer.prototype.invalidate.name, () => {
    it('deletes records before targetHeight and returns the new safe height', async () => {
      const blockTimestampRepository = mockObject<BlockTimestampRepository>({
        deleteAfterExclusive: async () => 1,
      })

      const indexer = new BlockTimestampIndexer(
        Logger.SILENT,
        mockObject<HourlyIndexer>({ subscribe: () => {} }),
        mockObject<BlockTimestampProvider>({}),
        mockObject<IndexerStateRepository>({}),
        blockTimestampRepository,
        'ethereum',
        UnixTime.ZERO,
        mockObject<SyncOptimizer>({}),
      )

      const targetHeight = 10
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(
        blockTimestampRepository.deleteAfterExclusive,
      ).toHaveBeenCalledWith('ethereum', new UnixTime(targetHeight))
      expect(newSafeHeight).toEqual(targetHeight)
    })
  })
})
