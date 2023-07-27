import { Logger } from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import {
  TotalSupplyRecord,
  TotalSupplyRepository,
} from '../../peripherals/database/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { getTotalSupplyConfigHash } from './getTotalSupplyConfigHash'
import { TotalSupplyProvider } from './TotalSupplyProvider'
import { TotalSupplyTokensConfig } from './TotalSupplyTokensConfig'
import {
  getMissingTotalSupplies,
  TotalSupplyUpdater,
} from './TotalSupplyUpdater'

describe(TotalSupplyUpdater.name, () => {
  const chainId = ChainId.ETHEREUM

  describe(TotalSupplyUpdater.prototype.start.name, () => {
    const NOW = UnixTime.now().toStartOf('hour')

    it('skips known timestamps', async () => {
      const clock = mockObject<Clock>({
        onEveryHour: (callback) => {
          callback(NOW.add(-1, 'hours'))
          callback(NOW)
          callback(NOW.add(1, 'hours'))
          callback(NOW.add(2, 'hours'))
          return () => {}
        },
      })

      const totalSupplyStatusRepository =
        mockObject<TotalSupplyStatusRepository>({
          getByConfigHash: async () => [NOW, NOW.add(1, 'hours')],
          add: async (x) =>
            `[chainId | ${x.chainId.toString()}]: ${x.configHash.toString()}`,
        })
      const totalSupplyRepository = mockObject<TotalSupplyRepository>({
        getByTimestamp: async () => [],
      })
      const totalSupplyProvider = mockObject<TotalSupplyProvider>({
        getChainId: () => chainId,
      })

      const totalSupplyUpdater = new TotalSupplyUpdater(
        totalSupplyProvider,
        mockObject<BlockNumberUpdater>(),
        totalSupplyRepository,
        totalSupplyStatusRepository,
        clock,
        [],
        Logger.SILENT,
        chainId,
        new UnixTime(0),
      )

      await totalSupplyUpdater.start()

      // Since only NOW and NOW + 1hr are known
      await waitForExpect(() => {
        expect(totalSupplyStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(totalSupplyStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash: getTotalSupplyConfigHash([]),
          timestamp: NOW.add(2, 'hours'),
          chainId,
        })
        expect(totalSupplyStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash: getTotalSupplyConfigHash([]),
          timestamp: NOW.add(-1, 'hours'),
          chainId,
        })
      })
    })
  })

  describe(TotalSupplyUpdater.prototype.update.name, () => {
    it('fetches and saves missing datapoints', async () => {
      const blockNumber = 1234

      const queryTimestamp = new UnixTime(1000)
      const reachableTimestamp = queryTimestamp.add(-1, 'hours')
      const unreachableTimestamp = queryTimestamp.add(1, 'hours')

      const fakeEth = fakeTokenInfo(AssetId.ETH, reachableTimestamp) // known
      const fakeUsdc = fakeTokenInfo(AssetId.USDC, reachableTimestamp) // known
      const fakeDai = fakeTokenInfo(AssetId.DAI, reachableTimestamp) // queryable
      const fakeArb = fakeTokenInfo(AssetId.ARB, unreachableTimestamp) // unreachable
      const fakeOp = fakeTokenInfo(AssetId.OP, unreachableTimestamp) // unreachable

      const tokensConfig: TotalSupplyTokensConfig[] = [
        fakeEth,
        fakeUsdc,
        fakeDai,
        fakeArb,
        fakeOp,
      ]

      const totalSupplyRepository = mockObject<TotalSupplyRepository>({
        getByTimestamp: async (chainId, timestamp) => [
          // Dai and Eth are known
          mockTotalSupply(fakeEth.assetId, timestamp, chainId),
          mockTotalSupply(fakeDai.assetId, timestamp, chainId),
        ],
        addOrUpdateMany: async () => 0,
      })

      const totalSupplyStatusRepository =
        mockObject<TotalSupplyStatusRepository>({
          add: async (x) =>
            `[chainId | ${x.chainId.toString()}]: ${x.configHash.toString()}`,
        })
      const totalSupplyProvider = mockObject<TotalSupplyProvider>({
        getChainId: () => chainId,
      })

      const blockNumberUpdater = mockObject<BlockNumberUpdater>({
        getBlockNumberWhenReady: async () => blockNumber,
      })

      const balanceUpdater = new TotalSupplyUpdater(
        totalSupplyProvider,
        blockNumberUpdater,
        totalSupplyRepository,
        totalSupplyStatusRepository,
        mockObject<Clock>(),
        tokensConfig,
        Logger.SILENT,
        chainId,
        new UnixTime(0),
      )

      const totalSupplies: TotalSupplyRecord[] = [
        mockTotalSupply(fakeEth.assetId, queryTimestamp, chainId),
        mockTotalSupply(fakeDai.assetId, queryTimestamp, chainId),
      ]
      const getTotalSupplies =
        mockFn<typeof totalSupplyProvider.getTotalSupplies>().resolvesTo(
          totalSupplies,
        )

      totalSupplyProvider.getTotalSupplies = getTotalSupplies

      await balanceUpdater.update(queryTimestamp)

      expect(getTotalSupplies).toHaveBeenOnlyCalledWith(
        [
          {
            assetId: fakeUsdc.assetId,
            tokenAddress: EthereumAddress(fakeUsdc.tokenAddress),
          },
        ],
        queryTimestamp,
        blockNumber,
      )

      expect(totalSupplyRepository.addOrUpdateMany).toHaveBeenOnlyCalledWith(
        totalSupplies,
      )
      expect(totalSupplyStatusRepository.add).toHaveBeenOnlyCalledWith({
        configHash: getTotalSupplyConfigHash(tokensConfig),
        timestamp: queryTimestamp,
        chainId,
      })
    })

    it('skips total supply queries if each of query tokens total supply is known', async () => {
      const queryTimestamp = new UnixTime(1000)
      const reachableTimestamp = queryTimestamp.add(-1, 'hours')

      const fakeEth = fakeTokenInfo(AssetId.ETH, reachableTimestamp)
      const fakeDai = fakeTokenInfo(AssetId.DAI, reachableTimestamp)
      const fakeArb = fakeTokenInfo(AssetId.ARB, reachableTimestamp)

      const tokensConfig: TotalSupplyTokensConfig[] = [
        fakeEth,
        fakeDai,
        fakeArb,
      ]

      const totalSupplyRepository = mockObject<TotalSupplyRepository>({
        getByTimestamp: async (chainId, timestamp) => [
          mockTotalSupply(fakeEth.assetId, timestamp, chainId),
          mockTotalSupply(fakeArb.assetId, timestamp, chainId),
          mockTotalSupply(fakeDai.assetId, timestamp, chainId),
        ],
      })
      const totalSupplyStatusRepository =
        mockObject<TotalSupplyStatusRepository>({
          add: async (x) =>
            `[chainId | ${x.chainId.toString()}]: ${x.configHash.toString()}`,
        })
      const totalSupplyProvider = mockObject<TotalSupplyProvider>({
        getChainId: () => chainId,
      })
      const balanceUpdater = new TotalSupplyUpdater(
        totalSupplyProvider,
        mockObject<BlockNumberUpdater>(),
        totalSupplyRepository,
        totalSupplyStatusRepository,
        mockObject<Clock>(),
        tokensConfig,
        Logger.SILENT,
        chainId,
        new UnixTime(0),
      )

      await balanceUpdater.update(queryTimestamp)
      expect(totalSupplyStatusRepository.add).toHaveBeenOnlyCalledWith({
        configHash: getTotalSupplyConfigHash(tokensConfig),
        timestamp: queryTimestamp,
        chainId,
      })
    })

    it('throws if timestamp < minTimestamp', async () => {
      const provider = mockObject<TotalSupplyProvider>({
        getChainId: () => chainId,
        getTotalSupplies: async () => [],
      })

      const status = mockObject<TotalSupplyStatusRepository>({
        add: async () => '',
      })
      const updater = new TotalSupplyUpdater(
        provider,
        mockObject<BlockNumberUpdater>(),
        mockObject<TotalSupplyRepository>(),
        status,
        mockObject<Clock>(),
        [],
        Logger.SILENT,
        chainId,
        new UnixTime(1000),
      )

      await expect(
        async () => await updater.update(new UnixTime(999)),
      ).toBeRejectedWith('Timestamp cannot be smaller than minTimestamp')

      expect(provider.getTotalSupplies).not.toHaveBeenCalled()
    })
  })

  describe(getMissingTotalSupplies.name, () => {
    it('returns missing tokens that requires update, skipping known ones and unreachable due to timestamp  ', () => {
      const timestamp = new UnixTime(2500)

      const fakeEth = fakeTokenInfo(AssetId.ETH, new UnixTime(1000))
      const fakeUsdc = fakeTokenInfo(AssetId.USDC, new UnixTime(1000))
      const fakeDai = fakeTokenInfo(AssetId.DAI, new UnixTime(1000))
      const fakeArb = fakeTokenInfo(AssetId.ARB, new UnixTime(1000))
      const fakeOp = fakeTokenInfo(AssetId.OP, new UnixTime(3000)) // Outside timestamp query range

      const tokensConfig: TotalSupplyTokensConfig[] = [
        fakeEth,
        fakeUsdc,
        fakeDai,
        fakeArb,
        fakeOp,
      ]

      const knownTokenSupplies: TotalSupplyRecord[] = [
        {
          timestamp: new UnixTime(1000),
          totalSupply: 1_000_000n,
          assetId: AssetId.ARB,
          chainId: ChainId.ARBITRUM,
        },
        {
          timestamp: new UnixTime(1000),
          totalSupply: 1_000_000n,
          assetId: AssetId.USDC,
          chainId: ChainId.ARBITRUM,
        },
      ]

      const result = getMissingTotalSupplies(
        timestamp,
        knownTokenSupplies,
        tokensConfig,
      )

      expect(result).toEqual([
        {
          assetId: AssetId.ETH,
          tokenAddress: EthereumAddress(fakeEth.tokenAddress),
        },
        {
          assetId: AssetId.DAI,
          tokenAddress: EthereumAddress(fakeDai.tokenAddress),
        },
      ])
    })
  })

  function fakeTokenInfo(
    assetId: AssetId,
    sinceTimestamp: UnixTime,
  ): TotalSupplyTokensConfig {
    return {
      assetId,
      sinceTimestamp,
      decimals: 18,
      tokenAddress: EthereumAddress.random().toString(),
    }
  }
})

function mockTotalSupply(
  assetId: AssetId,
  timestamp: UnixTime,
  chainId: ChainId,
): TotalSupplyRecord {
  return {
    assetId,
    chainId,
    timestamp,
    totalSupply: 1n,
  }
}
