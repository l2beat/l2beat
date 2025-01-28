import { Logger } from '@l2beat/backend-tools'
import type { AmountRecord, Database } from '@l2beat/database'
import {
  type AggLayerL2Token,
  type AggLayerNativeEtherPreminted,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type {
  Configuration,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { AggLayerService } from '../services/AggLayerService'
import type { SyncOptimizer } from '../utils/SyncOptimizer'
import { AggLayerIndexer } from './AggLayerIndexer'
import type { AggLayerAmountConfig } from './types'

describe(AggLayerIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(AggLayerIndexer.prototype.multiUpdate.name, () => {
    it('fetches amounts and saves them to DB', async () => {
      const from = 100
      const to = 1000
      const timestampToSync = new UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => timestampToSync,
      })

      const amountRepository = mockObject<Database['amount']>({
        insertMany: async () => 1,
      })
      const aggLayerService = mockObject<AggLayerService>({
        fetchAmounts: async () => [
          amount('a', 200, 123),
          amount('b', 200, 0), // zero value should not be saved in the DB
        ],
      })

      const blockNumber = 666
      const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
        findBlockNumberByChainAndTimestamp: async () => blockNumber,
      })

      const configurations = [
        actual('a', 100, null),
        actual('b', 100, null),
      ] as Configuration<AggLayerL2Token>[]

      const indexer = new AggLayerIndexer({
        aggLayerService,
        syncOptimizer,
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations,
        db: mockDatabase({
          amount: amountRepository,
          blockTimestamp: blockTimestampRepository,
        }),
      })

      const saveData = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await saveData()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(aggLayerService.fetchAmounts).toHaveBeenOnlyCalledWith(
        timestampToSync,
        blockNumber,
        configurations.map((c) => ({
          id: c.id,
          ...c.properties,
        })),
        undefined,
      )

      expect(amountRepository.insertMany).toHaveBeenOnlyCalledWith([
        amount('a', 200, 123),
      ])

      expect(safeHeight).toEqual(timestampToSync.toNumber())
    })

    it('finds native token, fetch amounts and saves them to DB', async () => {
      const from = 100
      const to = 1000
      const timestampToSync = new UnixTime(200)
      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => timestampToSync,
      })

      const amountRepository = mockObject<Database['amount']>({
        insertMany: async () => 2,
      })
      const aggLayerService = mockObject<AggLayerService>({
        fetchAmounts: async () => [amount('a', 200, 123), amount('b', 200, 10)],
      })

      const blockNumber = 666
      const blockTimestampRepository = mockObject<Database['blockTimestamp']>({
        findBlockNumberByChainAndTimestamp: async () => blockNumber,
      })

      const configurations = [
        actual('a', 100, null),
        actual('b', 100, null, {
          type: 'aggLayerNativeEtherPreminted',
        }),
      ]

      const indexer = new AggLayerIndexer({
        aggLayerService,
        syncOptimizer,
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations,
        db: mockDatabase({
          amount: amountRepository,
          blockTimestamp: blockTimestampRepository,
        }),
      })

      const saveData = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await saveData()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      const l2Token = configurations[0] as Configuration<AggLayerL2Token>
      const nativeToken =
        configurations[1] as Configuration<AggLayerNativeEtherPreminted>

      expect(aggLayerService.fetchAmounts).toHaveBeenOnlyCalledWith(
        timestampToSync,
        blockNumber,
        [
          {
            id: l2Token.id,
            ...l2Token.properties,
          },
        ],
        {
          id: nativeToken!.id,
          ...nativeToken!.properties,
        },
      )

      expect(amountRepository.insertMany).toHaveBeenOnlyCalledWith([
        amount('a', 200, 123),
        amount('b', 200, 10),
      ])

      expect(safeHeight).toEqual(timestampToSync.toNumber())
    })

    it('returns if optimized timestamp later than to', async () => {
      const from = 100
      const to = 1000
      const timestampToSync = new UnixTime(to + 100)

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: () => timestampToSync,
      })

      const configurations = [actual('a', 100, null)]

      const indexer = new AggLayerIndexer({
        aggLayerService: mockObject<AggLayerService>({}),
        syncOptimizer,
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations,
        db: mockDatabase({
          amount: mockObject(),
          blockTimestamp: mockObject(),
        }),
      })

      const saveData = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await saveData()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)
      expect(safeHeight).toEqual(to)
    })

    it('returns if optimized timestamp later than to', async () => {
      const from = 100
      const to = 1000

      const configurations = [actual('a', 100, null), actual('b', 100, null)]

      const indexer = new AggLayerIndexer({
        aggLayerService: mockObject<AggLayerService>({}),
        syncOptimizer: mockObject<SyncOptimizer>({
          getTimestampToSync: () => new UnixTime(1001),
        }),
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        configurations,
        db: mockDatabase({
          amount: mockObject(),
          blockTimestamp: mockObject(),
        }),
      })

      const saveData = await indexer.multiUpdate(from, to, configurations)
      const safeHeight = await saveData()

      expect(safeHeight).toEqual(to)
    })
  })

  describe(AggLayerIndexer.prototype.removeData.name, () => {
    it('deletes data for given configurations', async () => {
      const amountRepository = mockObject<Database['amount']>({
        deleteByConfigInTimeRange: async () => 1,
      })

      const indexer = new AggLayerIndexer({
        syncOptimizer: mockObject<SyncOptimizer>({}),
        chain: 'chain',
        parents: [],
        indexerService: mockObject<IndexerService>({}),
        logger: Logger.SILENT,
        serializeConfiguration: () => '',
        aggLayerService: mockObject<AggLayerService>({}),
        configurations: [
          mockObject<Configuration<AggLayerL2Token>>({ id: 'a' }),
        ],
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
): AmountRecord {
  return {
    configId,
    timestamp: new UnixTime(timestamp),
    amount: BigInt(amount),
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
  properties?: Partial<AggLayerAmountConfig>,
): Configuration<AggLayerAmountConfig> {
  return {
    id,
    properties: mockObject<AggLayerAmountConfig>({
      type: 'aggLayerL2Token',
      originNetwork: 0,
      l1Address: EthereumAddress.random(),
      ...properties,
    }),
    minHeight,
    maxHeight,
  }
}
