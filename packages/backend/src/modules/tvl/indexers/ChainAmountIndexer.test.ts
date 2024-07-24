import { Logger } from '@l2beat/backend-tools'
import { AmountRecord, Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { MOCK_TRX, mockDatabase } from '../../../test/database'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import {
  Configuration,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import { AmountService, ChainAmountConfig } from '../services/AmountService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { ChainAmountIndexer } from './ChainAmountIndexer'

describe(ChainAmountIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(ChainAmountIndexer.prototype.multiUpdate.name, () => {
    it('fetches amounts and saves them to DB', async () => {
      const from = 100
      const to = 1000
      const timestampToSync = new UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => timestampToSync,
      })

      const amountRepository = mockObject<Database['amount']>({
        addMany: async () => 1,
      })
      const amountService = mockObject<AmountService>({
        fetchAmounts: async () => [
          amount('a', 200, 123),
          amount('b', 200, 0), // zero value should not be saved in the DB
        ],
      })

      const blockNumber = 666
      const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
        findByChainAndTimestamp: async () => blockNumber,
      })

      const indexer = new ChainAmountIndexer({
        amountService,
        syncOptimizer,
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations: [],
        db: mockDatabase({
          amount: amountRepository,
          blockTimestamp: blockTimestampRepository,
        }),
      })

      const toUpdate = [actual('a', 100, null), actual('b', 100, null)]

      const safeHeight = await indexer.multiUpdate(from, to, toUpdate, MOCK_TRX)

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(amountService.fetchAmounts).toHaveBeenOnlyCalledWith(
        timestampToSync,
        blockNumber,
        toUpdate,
      )

      expect(amountRepository.addMany).toHaveBeenOnlyCalledWith(
        [amount('a', 200, 123)],
        MOCK_TRX,
      )

      expect(safeHeight).toEqual(timestampToSync.toNumber())
    })

    it('returns if optimized timestamp later than to', async () => {
      const from = 100
      const to = 1000
      const timestampToSync = new UnixTime(to + 100)

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => timestampToSync,
      })

      const indexer = new ChainAmountIndexer({
        amountService: mockObject<AmountService>({}),
        syncOptimizer,
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations: [],
        db: mockDatabase({
          amount: mockObject(),
          blockTimestamp: mockObject(),
        }),
      })

      const toUpdate = [actual('a', 100, null)]

      const safeHeight = await indexer.multiUpdate(from, to, toUpdate, MOCK_TRX)

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)
      expect(safeHeight).toEqual(to)
    })

    it('returns if optimized timestamp later than to', async () => {
      const from = 100
      const to = 1000

      const indexer = new ChainAmountIndexer({
        amountService: mockObject<AmountService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({
          getTimestampToSync: () => new UnixTime(1001),
        }),
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations: [],
        db: mockDatabase({
          amount: mockObject(),
          blockTimestamp: mockObject(),
        }),
      })

      const toUpdate = [actual('a', 100, null), actual('b', 100, null)]

      const safeHeight = await indexer.multiUpdate(from, to, toUpdate, MOCK_TRX)

      expect(safeHeight).toEqual(to)
    })
  })

  describe(ChainAmountIndexer.prototype.removeData.name, () => {
    it('deletes data for given configurations', async () => {
      const amountRepository = mockObject<Database['amount']>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = new ChainAmountIndexer({
        amountService: mockObject<AmountService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations: [],
        db: mockDatabase({
          amount: amountRepository,
          blockTimestamp: mockObject(),
        }),
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

function removal(id: string, from: number, to: number): RemovalConfiguration {
  return {
    id,
    from,
    to,
  }
}

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<ChainAmountConfig> {
  return {
    id,
    properties: mockObject<ChainAmountConfig>({}),
    minHeight,
    maxHeight,
  }
}
