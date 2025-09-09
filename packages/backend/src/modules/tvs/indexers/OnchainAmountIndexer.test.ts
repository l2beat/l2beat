import { Logger } from '@l2beat/backend-tools'
import type { Database, TvsAmountRecord } from '@l2beat/database'
import type {
  BalanceProvider,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import { OnchainAmountIndexer } from './OnchainAmountIndexer'

describe(OnchainAmountIndexer.name, () => {
  describe(OnchainAmountIndexer.prototype.multiUpdate.name, () => {
    it('fetches onchain amounts and saves them to DB (rpc)', async () => {
      const from = 100
      const to = 300
      const timestamp = UnixTime(200)
      const blockNumber = 12345

      const token1 = EthereumAddress.random()
      const token2 = EthereumAddress.random()
      const escrow1 = EthereumAddress.random()
      const escrow2 = EthereumAddress.random()

      const mockEscrowConfig1 = escrow('escrow-config-1', token1, escrow1)
      const mockEscrowConfig2 = escrow('escrow-config-2', token2, escrow2)
      const mockTotalSupplyConfig1 = totalSupply('supply-config-1', token1)
      const mockTotalSupplyConfig2 = totalSupply('supply-config-2', token2)

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

      const starknetTotalSupplyProvider =
        mockObject<StarknetTotalSupplyProvider>({
          getTotalSupplies: mockFn(),
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
        starknetTotalSupplyProvider,
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
        [token1, token2],
        blockNumber,
        'ethereum',
      )

      expect(
        starknetTotalSupplyProvider.getTotalSupplies,
      ).not.toHaveBeenCalled()

      const expectedRecords: TvsAmountRecord[] = [
        record('escrow-config-1', timestamp, 1000),
        record('escrow-config-2', timestamp, 2000),
        record('supply-config-1', timestamp, 5000),
        record('supply-config-2', timestamp, 6000),
      ]

      expect(tvsAmountRepository.insertMany).toHaveBeenOnlyCalledWith(
        expectedRecords,
      )
      expect(safeHeight).toEqual(timestamp)
    })

    it('fetches onchain amounts and saves them to DB (starknet)', async () => {
      const from = 100
      const to = 300
      const timestamp = UnixTime(200)
      const blockNumber = 12345

      const token1 = '0x1234'
      const token2 = '0x5678'

      const mockStarknetTotalSupplyConfig1 = starknetTotalSupply(
        'starknet-supply-config-1',
        token1,
      )
      const mockStarknetTotalSupplyConfig2 = starknetTotalSupply(
        'starknet-supply-config-2',
        token2,
      )

      const configs = [
        mockStarknetTotalSupplyConfig1,
        mockStarknetTotalSupplyConfig2,
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
        getBalances: mockFn(),
      })

      const totalSupplyProvider = mockObject<TotalSupplyProvider>({
        getTotalSupplies: mockFn(),
      })

      const starknetTotalSupplyProvider =
        mockObject<StarknetTotalSupplyProvider>({
          getTotalSupplies: mockFn().returnsOnce([BigInt(1000), BigInt(2000)]),
        })

      const tvsAmountRepository = mockObject<Database['tvsAmount']>({
        insertMany: mockFn().returnsOnce(undefined),
      })

      const indexer = new OnchainAmountIndexer({
        logger: Logger.SILENT,
        configurations: configs,
        chain: 'starknet',
        balanceProvider,
        totalSupplyProvider,
        starknetTotalSupplyProvider,
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
      ).toHaveBeenOnlyCalledWith('starknet', timestamp)

      expect(balanceProvider.getBalances).not.toHaveBeenCalled()

      expect(totalSupplyProvider.getTotalSupplies).not.toHaveBeenCalled()

      expect(
        starknetTotalSupplyProvider.getTotalSupplies,
      ).toHaveBeenOnlyCalledWith([token1, token2], blockNumber, 'starknet')

      const expectedRecords: TvsAmountRecord[] = [
        record('starknet-supply-config-1', timestamp, 1000),
        record('starknet-supply-config-2', timestamp, 2000),
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

      const mockEscrowConfig = escrow(
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
        starknetTotalSupplyProvider: mockObject<StarknetTotalSupplyProvider>(
          {},
        ),
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

      const mockEscrowConfig = escrow(
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
        starknetTotalSupplyProvider: mockObject<StarknetTotalSupplyProvider>(
          {},
        ),
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

      const mockEscrowConfig = escrow(
        'escrow-config-1',
        EthereumAddress.random(),
        EthereumAddress.random(),
      )

      const mockTotalSupplyConfig = totalSupply(
        'supply-config-1',
        EthereumAddress.random(),
      )

      const indexer = new OnchainAmountIndexer({
        logger: Logger.SILENT,
        configurations: [mockEscrowConfig, mockTotalSupplyConfig],
        chain: 'ethereum',
        balanceProvider: mockObject<BalanceProvider>({}),
        totalSupplyProvider: mockObject<TotalSupplyProvider>({}),
        starknetTotalSupplyProvider: mockObject<StarknetTotalSupplyProvider>(
          {},
        ),
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

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })
})

function escrow(
  id: string,
  tokenAddress: EthereumAddress,
  escrowAddress: EthereumAddress,
) {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      type: 'balanceOfEscrow' as const,
      address: tokenAddress,
      escrowAddress: escrowAddress,
      sinceTimestamp: 0,
      chain: 'chain',
      decimals: 18,
    },
  }
}

function totalSupply(id: string, tokenAddress: EthereumAddress) {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      type: 'totalSupply' as const,
      address: tokenAddress,
      sinceTimestamp: 0,
      chain: 'chain',
      decimals: 18,
    },
  }
}

function starknetTotalSupply(id: string, tokenAddress: string) {
  return {
    id,
    minHeight: 0,
    maxHeight: null,
    properties: {
      type: 'starknetTotalSupply' as const,
      address: tokenAddress,
      sinceTimestamp: 0,
      chain: 'chain',
      decimals: 18,
    },
  }
}

function record(configurationId: string, timestamp: UnixTime, value: number) {
  return {
    configurationId,
    timestamp: timestamp,
    amount: BigInt(value),
  }
}
