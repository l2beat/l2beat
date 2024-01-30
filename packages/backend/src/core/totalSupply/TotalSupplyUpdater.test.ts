import { Logger } from '@l2beat/backend-tools'
import { AssetId, ChainId, Token, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import {
  TotalSupplyRecord,
  TotalSupplyRepository,
} from '../../peripherals/database/TotalSupplyRepository'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { getMockToken } from '../../test/token'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { getTotalSupplyConfigHash } from './getTotalSupplyConfigHash'
import { TotalSupplyProvider } from './TotalSupplyProvider'
import {
  getMissingTotalSupplies,
  TotalSupplyUpdater,
} from './TotalSupplyUpdater'

describe(TotalSupplyUpdater.name, () => {
  const chainId = ChainId.ARBITRUM

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

      const fakeEth = fakeToken(AssetId.ETH, reachableTimestamp) // known
      const fakeUsdc = fakeToken(AssetId.USDC, reachableTimestamp) // known
      const fakeDai = fakeToken(AssetId.DAI, reachableTimestamp) // queryable
      const fakeArb = fakeToken(AssetId.ARB, unreachableTimestamp) // unreachable
      const fakeOp = fakeToken(AssetId.OP, unreachableTimestamp) // unreachable

      const tokensConfig = [
        fakeEth,
        fakeUsdc,
        fakeDai,
        fakeArb,
        fakeOp,
      ] as Token[]

      const totalSupplyRepository = mockObject<TotalSupplyRepository>({
        getByTimestamp: async (chainId, timestamp) => [
          // Dai and Eth are known
          mockTotalSupply(fakeEth.id, timestamp, chainId),
          mockTotalSupply(fakeDai.id, timestamp, chainId),
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
        mockTotalSupply(fakeEth.id, queryTimestamp, chainId),
        mockTotalSupply(fakeDai.id, queryTimestamp, chainId),
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
            assetId: fakeUsdc.id,
            tokenAddress: fakeUsdc.address,
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

      const fakeEth = fakeToken(AssetId.ETH, reachableTimestamp)
      const fakeDai = fakeToken(AssetId.DAI, reachableTimestamp)
      const fakeArb = fakeToken(AssetId.ARB, reachableTimestamp)

      const tokensConfig = [fakeEth, fakeDai, fakeArb] as Token[]

      const totalSupplyRepository = mockObject<TotalSupplyRepository>({
        getByTimestamp: async (chainId, timestamp) => [
          mockTotalSupply(fakeEth.id, timestamp, chainId),
          mockTotalSupply(fakeArb.id, timestamp, chainId),
          mockTotalSupply(fakeDai.id, timestamp, chainId),
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

      const fakeEth = fakeToken(AssetId.ETH, new UnixTime(1000))
      const fakeUsdc = fakeToken(AssetId.USDC, new UnixTime(1000))
      const fakeDai = fakeToken(AssetId.DAI, new UnixTime(1000))
      const fakeArb = fakeToken(AssetId.ARB, new UnixTime(1000))
      const fakeOp = fakeToken(AssetId.OP, new UnixTime(3000)) // Outside timestamp query range

      const tokensConfig = [
        fakeEth,
        fakeUsdc,
        fakeDai,
        fakeArb,
        fakeOp,
      ] as Token[]

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
          tokenAddress: fakeEth.address,
        },
        {
          assetId: AssetId.DAI,
          tokenAddress: fakeDai.address,
        },
      ])
    })
  })

  function fakeToken(assetId: AssetId, sinceTimestamp: UnixTime) {
    return {
      ...getMockToken(),
      id: assetId,
      sinceTimestamp,
      chainId: ChainId.ARBITRUM,
      type: 'EBV',
      formula: 'totalSupply',
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
