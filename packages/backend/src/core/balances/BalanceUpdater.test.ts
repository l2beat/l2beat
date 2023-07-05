import { TokenInfo } from '@l2beat/config'
import { Logger } from '@l2beat/shared'
import {
  AssetId,
  Bytes,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import waitForExpect from 'wait-for-expect'

import {
  BalanceRecord,
  BalanceRepository,
} from '../../peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { Clock } from '../Clock'
import { BalanceProject } from './BalanceProject'
import { BalanceUpdater, getMissingData } from './BalanceUpdater'
import { getBalanceConfigHash } from './getBalanceConfigHash'

describe(BalanceUpdater.name, () => {
  describe(BalanceUpdater.prototype.start.name, () => {
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

      const balanceStatusRepository = mockObject<BalanceStatusRepository>({
        getByConfigHash: async () => [NOW, NOW.add(1, 'hours')],
        add: async (x) => x.configHash,
      })
      const balanceRepository = mockObject<BalanceRepository>({
        getByTimestamp: async () => [],
      })

      const balanceUpdater = new BalanceUpdater(
        mockObject<MulticallClient>(),
        mockObject<BlockNumberUpdater>(),
        balanceRepository,
        balanceStatusRepository,
        clock,
        [],
        Logger.SILENT,
        ChainId.ETHEREUM,
      )

      await balanceUpdater.start()

      await waitForExpect(() => {
        expect(balanceStatusRepository.add).toHaveBeenCalledTimes(2)
        expect(balanceStatusRepository.add).toHaveBeenNthCalledWith(1, {
          configHash: getBalanceConfigHash([]),
          timestamp: NOW.add(2, 'hours'),
        })
        expect(balanceStatusRepository.add).toHaveBeenNthCalledWith(2, {
          configHash: getBalanceConfigHash([]),
          timestamp: NOW.add(-1, 'hours'),
        })
      })
    })
  })

  describe(BalanceUpdater.prototype.update.name, () => {
    it('fetches and saves missing datapoints', async () => {
      const holderAddress = EthereumAddress.random()
      const projects: BalanceProject[] = [
        {
          projectId: ProjectId('first'),
          escrows: [
            {
              address: holderAddress,
              sinceTimestamp: new UnixTime(1000),
              tokens: [
                fakeTokenInfo(AssetId('foo'), new UnixTime(1000)),
                fakeTokenInfo(AssetId('bar'), new UnixTime(1000)),
                fakeTokenInfo(AssetId('baz'), new UnixTime(1000)),
              ],
            },
          ],
        },
      ]

      const balanceRepository = mockObject<BalanceRepository>({
        getByTimestamp: async (chainId, timestamp) => [
          mockBalance(AssetId('baz'), timestamp, holderAddress, chainId),
        ],
        addOrUpdateMany: async () => 0,
      })
      const balanceStatusRepository = mockObject<BalanceStatusRepository>({
        add: async (x) => x.configHash,
      })
      const balanceUpdater = new BalanceUpdater(
        mockObject<MulticallClient>(),
        mockObject<BlockNumberUpdater>(),
        balanceRepository,
        balanceStatusRepository,
        mockObject<Clock>(),
        projects,
        Logger.SILENT,
        ChainId.ETHEREUM,
      )

      const timestamp = new UnixTime(2000)
      const balances: BalanceRecord[] = [
        mockBalance(AssetId('foo'), timestamp, holderAddress, ChainId.ETHEREUM),
        mockBalance(AssetId('bar'), timestamp, holderAddress, ChainId.ETHEREUM),
      ]
      const fetchBalances =
        mockFn<typeof balanceUpdater.fetchBalances>().resolvesTo(balances)
      balanceUpdater.fetchBalances = fetchBalances

      await balanceUpdater.update(timestamp)
      expect(fetchBalances).toHaveBeenOnlyCalledWith(
        [
          { assetId: AssetId('foo'), holder: holderAddress },
          { assetId: AssetId('bar'), holder: holderAddress },
        ],
        timestamp,
      )
      expect(balanceRepository.addOrUpdateMany).toHaveBeenOnlyCalledWith(
        balances,
      )
      expect(balanceStatusRepository.add).toHaveBeenOnlyCalledWith({
        configHash: getBalanceConfigHash(projects),
        timestamp,
      })
    })

    it('skips work if everything is known', async () => {
      const holderAddress = EthereumAddress.random()
      const projects: BalanceProject[] = [
        {
          projectId: ProjectId('first'),
          escrows: [
            {
              address: holderAddress,
              sinceTimestamp: new UnixTime(1000),
              tokens: [
                fakeTokenInfo(AssetId('foo'), new UnixTime(1000)),
                fakeTokenInfo(AssetId('bar'), new UnixTime(1000)),
                fakeTokenInfo(AssetId('baz'), new UnixTime(1000)),
              ],
            },
          ],
        },
      ]

      const balanceRepository = mockObject<BalanceRepository>({
        getByTimestamp: async (chainId, timestamp) => [
          mockBalance(AssetId('foo'), timestamp, holderAddress, chainId),
          mockBalance(AssetId('bar'), timestamp, holderAddress, chainId),
          mockBalance(AssetId('baz'), timestamp, holderAddress, chainId),
        ],
      })
      const balanceStatusRepository = mockObject<BalanceStatusRepository>({
        add: async (x) => x.configHash,
      })
      const balanceUpdater = new BalanceUpdater(
        mockObject<MulticallClient>(),
        mockObject<BlockNumberUpdater>(),
        balanceRepository,
        balanceStatusRepository,
        mockObject<Clock>(),
        projects,
        Logger.SILENT,
        ChainId.ETHEREUM,
      )

      const timestamp = new UnixTime(2000)

      await balanceUpdater.update(timestamp)
      expect(balanceStatusRepository.add).toHaveBeenOnlyCalledWith({
        configHash: getBalanceConfigHash(projects),
        timestamp,
      })
    })
  })

  describe(BalanceUpdater.prototype.fetchBalances.name, () => {
    it('performs a multicall for missing data', async () => {
      const multicallClient = mockObject<MulticallClient>({
        multicall: async () => [
          { success: true, data: Bytes.fromNumber(69).padStart(32) },
          { success: true, data: Bytes.fromNumber(420).padStart(32) },
        ],
      })
      const blockNumberUpdater = mockObject<BlockNumberUpdater>({
        getBlockNumberWhenReady: async () => 1234,
      })
      const balanceUpdater = new BalanceUpdater(
        multicallClient,
        blockNumberUpdater,
        mockObject<BalanceRepository>(),
        mockObject<BalanceStatusRepository>(),
        mockObject<Clock>(),
        [],
        Logger.SILENT,
        ChainId.ETHEREUM,
      )

      const timestamp = UnixTime.now()
      const holderA = EthereumAddress.random()
      const holderB = EthereumAddress.random()
      const results = await balanceUpdater.fetchBalances(
        [
          { assetId: AssetId.DAI, holder: holderA },
          { assetId: AssetId.ETH, holder: holderB },
        ],
        timestamp,
      )
      expect(results).toEqual([
        {
          assetId: AssetId.DAI,
          holderAddress: holderA,
          balance: 69n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.ETH,
          holderAddress: holderB,
          balance: 420n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })
  })

  describe(getMissingData.name, () => {
    it('returns queries to be made', () => {
      const timestamp = new UnixTime(2500)
      const escrow = EthereumAddress.random()
      const projects: BalanceProject[] = [
        {
          projectId: ProjectId('first'),
          escrows: [
            {
              address: escrow,
              sinceTimestamp: new UnixTime(2000),
              tokens: [
                fakeTokenInfo(AssetId.ETH, new UnixTime(1000)),
                fakeTokenInfo(AssetId('foo'), new UnixTime(1000)),
                fakeTokenInfo(AssetId('bar'), new UnixTime(1000)),
                fakeTokenInfo(AssetId('baz'), new UnixTime(1000)),
                fakeTokenInfo(AssetId.DAI, new UnixTime(3000)),
              ],
            },
            {
              address: EthereumAddress.random(),
              sinceTimestamp: new UnixTime(3000),
              tokens: [fakeTokenInfo(AssetId.ETH, new UnixTime(1000))],
            },
          ],
        },
      ]

      const known: BalanceRecord[] = [
        {
          timestamp,
          assetId: AssetId('bar'),
          holderAddress: escrow,
          balance: 1n,
          chainId: ChainId.ETHEREUM,
        },
        {
          timestamp,
          assetId: AssetId('baz'),
          holderAddress: escrow,
          balance: 1n,
          chainId: ChainId.ETHEREUM,
        },
      ]

      const result = getMissingData(timestamp, known, projects)
      expect(result).toEqual([
        { assetId: AssetId.ETH, holder: escrow },
        { assetId: AssetId('foo'), holder: escrow },
      ])
    })
  })

  function fakeTokenInfo(id: AssetId, sinceTimestamp: UnixTime): TokenInfo {
    return {
      id,
      sinceTimestamp,
      name: 'Fake',
      coingeckoId: CoingeckoId('fake-token'),
      symbol: 'FKT',
      decimals: 18,
      address: EthereumAddress.random(),
      category: 'other',
    }
  }
})
function mockBalance(
  assetId: AssetId,
  timestamp: UnixTime,
  holderAddress: EthereumAddress,
  chainId: ChainId,
): BalanceRecord {
  return {
    assetId,
    timestamp,
    balance: 1n,
    holderAddress,
    chainId,
  }
}
