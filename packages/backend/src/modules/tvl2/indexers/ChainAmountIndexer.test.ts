import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import {
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../../tools/uif/multi/types'
import {
  AmountRecord,
  AmountRepository,
} from '../repositories/AmountRepository'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { AmountService, ChainAmountConfig } from '../services/AmountService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { ChainAmountIndexer } from './ChainAmountIndexer'

describe(ChainAmountIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(ChainAmountIndexer.prototype.multiUpdate.name, () => {
    it('fetches amounts and saves them to DB', async () => {
      const from = new UnixTime(100)
      const to = new UnixTime(1000)
      const timestampToSync = new UnixTime(100)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => timestampToSync,
      })

      const amountRepository = mockObject<AmountRepository>({
        addMany: async () => 1,
      })
      const amountService = mockObject<AmountService>({
        fetchAmounts: async () => [
          amount('a', 100, 123),
          amount('b', 100, 0), // zero value should not be saved in the DB
        ],
      })

      const blockNumber = 666
      const blockTimestampRepository = mockObject<BlockTimestampRepository>({
        findByChainAndTimestamp: async () => blockNumber,
      })

      const indexer = new ChainAmountIndexer({
        amountService,
        amountRepository,
        blockTimestampRepository,
        syncOptimizer,
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        encode: () => '',
        decode: () => mockObject<ChainAmountConfig>({}),
        configurations: [],
      })

      const toUpdate = [
        update('a', 100, null, false),
        update('b', 100, null, false),
        update('c', 100, null, true), // configuration with data should not be fetched
      ]

      const safeHeight = await indexer.multiUpdate(
        from.toNumber(),
        to.toNumber(),
        toUpdate,
      )

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(
        from.toNumber(),
        to.toNumber(),
      )

      expect(amountService.fetchAmounts).toHaveBeenOnlyCalledWith(
        timestampToSync,
        blockNumber,
        toUpdate.slice(0, 2),
      )

      expect(amountRepository.addMany).toHaveBeenOnlyCalledWith([
        amount('a', 100, 123),
      ])

      expect(safeHeight).toEqual(timestampToSync.toNumber())
    })
  })

  describe(ChainAmountIndexer.prototype.removeData.name, () => {
    it('deletes data for given configurations', async () => {
      const amountRepository = mockObject<AmountRepository>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = new ChainAmountIndexer({
        amountService: mockObject<AmountService>({}),
        amountRepository,
        blockTimestampRepository: mockObject<BlockTimestampRepository>({}),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        encode: () => '',
        decode: () => mockObject<ChainAmountConfig>({}),
        configurations: [],
      })

      const toRemove = [removal('a', 100, 200), removal('b', 200, 300)]

      await indexer.removeData(toRemove)

      expect(
        amountRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(1, 'a', new UnixTime(100), new UnixTime(200))

      expect(
        amountRepository.deleteByConfigInTimeRange,
      ).toHaveBeenLastCalledWith('b', new UnixTime(200), new UnixTime(300))
    })
  })
})

function amount(
  configId: string,
  timestamp: number,
  amount: number,
): AmountRecord & { type: 'escrow' | 'totalSupply' } {
  return {
    configId,
    timestamp: new UnixTime(timestamp),
    amount: BigInt(amount),
    type: 'escrow',
  }
}

function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration<ChainAmountConfig> {
  return {
    id,
    properties: mockObject<ChainAmountConfig>({}),
    from,
    to,
  }
}

function update(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  hasData: boolean,
): UpdateConfiguration<ChainAmountConfig> {
  return {
    id,
    properties: mockObject<ChainAmountConfig>({}),
    minHeight,
    maxHeight,
    hasData,
  }
}
