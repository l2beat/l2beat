import { Logger, mock } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import {
  AssetId,
  Bytes,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BalanceProject } from '../../../src/core/balances/BalanceProject'
import {
  BalanceUpdater,
  getMissingData,
} from '../../../src/core/balances/BalanceUpdater'
import { getBalanceConfigHash } from '../../../src/core/balances/getBalanceConfigHash'
import { BlockNumberUpdater } from '../../../src/core/BlockNumberUpdater'
import { Clock } from '../../../src/core/Clock'
import {
  BalanceRecord,
  BalanceRepository,
} from '../../../src/peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../../src/peripherals/database/BalanceStatusRepository'
import { MulticallClient } from '../../../src/peripherals/ethereum/MulticallClient'

describe(BalanceUpdater.name, () => {
  describe(BalanceUpdater.prototype.start.name, () => {
    const NOW = UnixTime.now().toStartOf('hour')

    it('skips known timestamps', async () => {
      const clock = mock<Clock>({
        onEveryHour: (callback) => {
          callback(NOW.add(-1, 'hours'))
          callback(NOW)
          callback(NOW.add(1, 'hours'))
          callback(NOW.add(2, 'hours'))
          return () => {}
        },
      })

      const balanceStatusRepository = mock<BalanceStatusRepository>({
        getByConfigHash: async () => [NOW, NOW.add(1, 'hours')],
        add: async (x) => x.configHash,
      })
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: async () => [],
      })

      const balanceUpdater = new BalanceUpdater(
        mock<MulticallClient>(),
        mock<BlockNumberUpdater>(),
        balanceRepository,
        balanceStatusRepository,
        clock,
        [],
        Logger.SILENT,
      )

      await balanceUpdater.start()

      await waitForExpect(() => {
        expect(balanceStatusRepository.add).toHaveBeenCalledExactlyWith([
          [
            {
              configHash: getBalanceConfigHash([]),
              timestamp: NOW.add(2, 'hours'),
            },
          ],
          [
            {
              configHash: getBalanceConfigHash([]),
              timestamp: NOW.add(-1, 'hours'),
            },
          ],
        ])
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

      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: async (timestamp) => [
          { assetId: AssetId('baz'), timestamp, balance: 1n, holderAddress },
        ],
        addOrUpdateMany: async () => 0,
      })
      const balanceStatusRepository = mock<BalanceStatusRepository>({
        add: async (x) => x.configHash,
      })
      const balanceUpdater = new BalanceUpdater(
        mock<MulticallClient>(),
        mock<BlockNumberUpdater>(),
        balanceRepository,
        balanceStatusRepository,
        mock<Clock>(),
        projects,
        Logger.SILENT,
      )

      const timestamp = new UnixTime(2000)
      const balances: BalanceRecord[] = [
        { assetId: AssetId('foo'), timestamp, balance: 1n, holderAddress },
        { assetId: AssetId('bar'), timestamp, balance: 1n, holderAddress },
      ]
      const fetchBalances =
        mockFn<typeof balanceUpdater.fetchBalances>().resolvesTo(balances)
      balanceUpdater.fetchBalances = fetchBalances

      await balanceUpdater.update(timestamp)
      expect(fetchBalances).toHaveBeenCalledExactlyWith([
        [
          [
            { assetId: AssetId('foo'), holder: holderAddress },
            { assetId: AssetId('bar'), holder: holderAddress },
          ],
          timestamp,
        ],
      ])
      expect(balanceRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [balances],
      ])
      expect(balanceStatusRepository.add).toHaveBeenCalledExactlyWith([
        [{ configHash: getBalanceConfigHash(projects), timestamp }],
      ])
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

      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: async (timestamp) => [
          { assetId: AssetId('foo'), timestamp, balance: 1n, holderAddress },
          { assetId: AssetId('bar'), timestamp, balance: 1n, holderAddress },
          { assetId: AssetId('baz'), timestamp, balance: 1n, holderAddress },
        ],
      })
      const balanceStatusRepository = mock<BalanceStatusRepository>({
        add: async (x) => x.configHash,
      })
      const balanceUpdater = new BalanceUpdater(
        mock<MulticallClient>(),
        mock<BlockNumberUpdater>(),
        balanceRepository,
        balanceStatusRepository,
        mock<Clock>(),
        projects,
        Logger.SILENT,
      )

      const timestamp = new UnixTime(2000)

      await balanceUpdater.update(timestamp)
      expect(balanceStatusRepository.add).toHaveBeenCalledExactlyWith([
        [{ configHash: getBalanceConfigHash(projects), timestamp }],
      ])
    })
  })

  describe(BalanceUpdater.prototype.fetchBalances.name, () => {
    it('performs a multicall for missing data', async () => {
      const multicallClient = mock<MulticallClient>({
        multicall: async () => [
          { success: true, data: Bytes.fromNumber(69).padStart(32) },
          { success: true, data: Bytes.fromNumber(420).padStart(32) },
        ],
      })
      const blockNumberUpdater = mock<BlockNumberUpdater>({
        getBlockNumberWhenReady: async () => 1234n,
      })
      const balanceUpdater = new BalanceUpdater(
        multicallClient,
        blockNumberUpdater,
        mock<BalanceRepository>(),
        mock<BalanceStatusRepository>(),
        mock<Clock>(),
        [],
        Logger.SILENT,
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
        },
        {
          assetId: AssetId.ETH,
          holderAddress: holderB,
          balance: 420n,
          timestamp,
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
        },
        {
          timestamp,
          assetId: AssetId('baz'),
          holderAddress: escrow,
          balance: 1n,
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
