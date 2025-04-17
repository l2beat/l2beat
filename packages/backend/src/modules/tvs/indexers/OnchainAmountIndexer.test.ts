import { Logger } from '@l2beat/backend-tools'
import type { TvsAmountRecord } from '@l2beat/database/dist/tvs/amount/entity'
import type { BalanceProvider, TotalSupplyProvider } from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type {
  BalanceOfEscrowAmountFormula,
  TotalSupplyAmountFormula,
} from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../../tvl/utils/SyncOptimizer'
import { OnchainAmountIndexer } from './OnchainAmountIndexer'

describe(OnchainAmountIndexer.name, () => {
  describe(OnchainAmountIndexer.prototype.multiUpdate.name, () => {
    it('fetches balances and total supplies and saves them to DB', async () => {
      const from = 100
      const to = 300
      const timestamp = UnixTime(200)
      const blockNumber = 12345

      const token1 = EthereumAddress.random()
      const token2 = EthereumAddress.random()
      const token3 = EthereumAddress.random()
      const token4 = EthereumAddress.random()
      const escrow1 = EthereumAddress.random()
      const escrow2 = EthereumAddress.random()

      const mockEscrowConfig1 = createMockEscrowConfig(
        'escrow-config-1',
        token1,
        escrow1,
      )
      const mockEscrowConfig2 = createMockEscrowConfig(
        'escrow-config-2',
        token2,
        escrow2,
      )
      const mockTotalSupplyConfig1 = createMockTotalSupplyConfig(
        'supply-config-1',
        token3,
      )
      const mockTotalSupplyConfig2 = createMockTotalSupplyConfig(
        'supply-config-2',
        token4,
      )

      const configs = [
        mockEscrowConfig1,
        mockEscrowConfig2,
        mockTotalSupplyConfig1,
        mockTotalSupplyConfig2,
      ]

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestamp),
      })

      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn().returnsOnce(blockNumber),
      })

      const balanceProvider = mockObject<BalanceProvider>({
        getBalances: mockFn().returnsOnce([BigInt(1000), BigInt(2000)]),
      })

      const totalSupplyProvider = mockObject<TotalSupplyProvider>({
        getTotalSupplies: mockFn().returnsOnce([BigInt(5000), BigInt(6000)]),
      })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new OnchainAmountIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        chain: 'ethereum',
        balanceProvider,
        totalSupplyProvider,
        db: mockDatabase({
          tvsAmount: tvsAmountRepository,
          tvsBlockTimestamp: tvsBlockTimestampRepository,
        }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, configs)
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)

      expect(
        tvsBlockTimestampRepository.findBlockNumberByChainAndTimestamp,
      ).toHaveBeenOnlyCalledWith('ethereum', timestamp)

      expect(balanceProvider.getBalances).toHaveBeenOnlyCalledWith(
        [
          { token: token1, holder: escrow1 },
          { token: token2, holder: escrow2 },
        ],
        blockNumber,
        'ethereum',
      )

      expect(totalSupplyProvider.getTotalSupplies).toHaveBeenOnlyCalledWith(
        [token3, token4],
        blockNumber,
        'ethereum',
      )

      const expectedRecords: TvsAmountRecord[] = [
        {
          configurationId: 'escrow-config-1',
          timestamp: timestamp,
          amount: BigInt(1000),
        },
        {
          configurationId: 'escrow-config-2',
          timestamp: timestamp,
          amount: BigInt(2000),
        },
        {
          configurationId: 'supply-config-1',
          timestamp: timestamp,
          amount: BigInt(5000),
        },
        {
          configurationId: 'supply-config-2',
          timestamp: timestamp,
          amount: BigInt(6000),
        },
      ]

      expect(tvsAmountRepository.insertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(timestamp)
    })

    it('returns to value if timestamp is out of range', async () => {
      const from = 100
      const to = 300
      const timestamp = UnixTime(400) // Greater than 'to'

      const mockEscrowConfig = createMockEscrowConfig(
        'escrow-config-1',
        EthereumAddress.random(),
        EthereumAddress.random(),
      )

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestamp),
      })

      const indexer = new OnchainAmountIndexer({
        logger: Logger.SILENT,
        configurations: [mockEscrowConfig],
        chain: 'ethereum',
        balanceProvider: mockObject<BalanceProvider>({}),
        totalSupplyProvider: mockObject<TotalSupplyProvider>({}),
        db: mockDatabase({}),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const updateFn = await indexer.multiUpdate(from, to, [mockEscrowConfig])
      const safeHeight = await updateFn()

      expect(syncOptimizer.getTimestampToSync).toHaveBeenOnlyCalledWith(from)
      expect(safeHeight).toEqual(to)
    })

    it('throws an error if block number is not found', async () => {
      const from = 100
      const to = 300
      const timestamp = UnixTime(200)

      const mockEscrowConfig = createMockEscrowConfig(
        'escrow-config-1',
        EthereumAddress.random(),
        EthereumAddress.random(),
      )

      const syncOptimizer = mockObject<SyncOptimizer>({
        getTimestampToSync: mockFn().returnsOnce(timestamp),
      })

      const tvsBlockTimestampRepository = mockObject<
        Database['tvsBlockTimestamp']
      >({
        findBlockNumberByChainAndTimestamp: mockFn().returnsOnce(null),
      })

      const indexer = new OnchainAmountIndexer({
        logger: Logger.SILENT,
        configurations: [mockEscrowConfig],
        chain: 'ethereum',
        balanceProvider: mockObject<BalanceProvider>({}),
        totalSupplyProvider: mockObject<TotalSupplyProvider>({}),
        db: mockDatabase({
          tvsBlockTimestamp: tvsBlockTimestampRepository,
        }),
        syncOptimizer,
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      await expect(async () => {
        await indexer.multiUpdate(from, to, [mockEscrowConfig])
      }).toBeRejectedWith(`Block number not found for timestamp: ${timestamp}`)
    })
  })

  describe(OnchainAmountIndexer.prototype.removeData.name, () => {
    it('deletes records for configuration in time range', async () => {
      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        deleteByConfigInTimeRange: mockFn().returnsOnce(3).returnsOnce(2),
      })

      const mockEscrowConfig = createMockEscrowConfig(
        'escrow-config-1',
        EthereumAddress.random(),
        EthereumAddress.random(),
      )

      const mockTotalSupplyConfig = createMockTotalSupplyConfig(
        'supply-config-1',
        EthereumAddress.random(),
      )

      const indexer = new OnchainAmountIndexer({
        logger: Logger.SILENT,
        configurations: [mockEscrowConfig, mockTotalSupplyConfig],
        chain: 'ethereum',
        balanceProvider: mockObject<BalanceProvider>({}),
        totalSupplyProvider: mockObject<TotalSupplyProvider>({}),
        db: mockDatabase({ tvsAmount: tvsAmountRepository }),
        syncOptimizer: mockObject<SyncOptimizer>({}),
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      })

      const removalConfigs = [
        {
          id: 'escrow-config-1',
          from: 100,
          to: 200,
        },
        {
          id: 'supply-config-1',
          from: 300,
          to: 400,
        },
      ]

      await indexer.removeData(removalConfigs)

      expect(
        tvsAmountRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        1,
        removalConfigs[0].id,
        UnixTime(removalConfigs[0].from),
        UnixTime(removalConfigs[0].to),
      )

      expect(
        tvsAmountRepository.deleteByConfigInTimeRange,
      ).toHaveBeenNthCalledWith(
        2,
        removalConfigs[1].id,
        UnixTime(removalConfigs[1].from),
        UnixTime(removalConfigs[1].to),
      )
    })
  })

  function createMockEscrowConfig(
    id: string,
    tokenAddress: EthereumAddress,
    escrowAddress: EthereumAddress,
  ): Configuration<BalanceOfEscrowAmountFormula> {
    return mockObject<Configuration<BalanceOfEscrowAmountFormula>>({
      id,
      minHeight: 0,
      maxHeight: null,
      properties: mockObject<BalanceOfEscrowAmountFormula>({
        type: 'balanceOfEscrow' as const,
        address: tokenAddress,
        escrowAddress: escrowAddress,
        sinceTimestamp: 0,
        untilTimestamp: undefined,
      }),
    })
  }

  function createMockTotalSupplyConfig(
    id: string,
    tokenAddress: EthereumAddress,
  ): Configuration<TotalSupplyAmountFormula> {
    return mockObject<Configuration<TotalSupplyAmountFormula>>({
      id,
      minHeight: 0,
      maxHeight: null,
      properties: mockObject<TotalSupplyAmountFormula>({
        type: 'totalSupply' as const,
        address: tokenAddress,
        sinceTimestamp: 0,
        untilTimestamp: undefined,
      }),
    })
  }

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})
