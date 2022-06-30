import {
  AssetId,
  Bytes,
  CoingeckoId,
  EthereumAddress,
  Hash256,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { BalanceUpdater } from '../../src/core/BalanceUpdater'
import { ProjectInfo } from '../../src/model/ProjectInfo'
import {
  BalanceRecord,
  BalanceRepository,
} from '../../src/peripherals/database/BalanceRepository'
import { BalanceStatusRepository } from '../../src/peripherals/database/BalanceStatusRepository'
import { BlockNumberRepository } from '../../src/peripherals/database/BlockNumberRepository'
import { BalanceCall } from '../../src/peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../../src/peripherals/ethereum/MulticallClient'

describe(BalanceUpdater.name, () => {
  const HOLDER_A = EthereumAddress.random()
  const HOLDER_B = EthereumAddress.random()
  const HOLDER_C = EthereumAddress.random()

  const ASSET_A = AssetId('eth-ether')
  const ASSET_B = AssetId('usdc-usd-coin')
  const ASSET_C = AssetId('usdt-tether-usd')
  const ASSET_D = AssetId('zrx-0x-protocol-token')

  const START = UnixTime.now()
  const BEFORE = START.add(-1, 'hours')
  const AFTER = START.add(1, 'hours')
  const SINCE_0 = START.add(-100, 'days')
  const SINCE_1 = START.add(-50, 'days')
  const START_BLOCK_NUMBER = 10000n
  const AFTER_BLOCK_NUMBER = 11000n

  const mockToken = (id: AssetId, sinceTimestamp: UnixTime): TokenInfo => {
    return {
      id,
      name: 'fake',
      symbol: 'FK',
      decimals: 18,
      coingeckoId: CoingeckoId('fake'),
      sinceTimestamp,
      category: 'other',
    }
  }

  const PROJECTS: ProjectInfo[] = [
    {
      name: 'Arbitrum',
      projectId: ProjectId('arbitrum'),
      bridges: [
        {
          address: HOLDER_A,
          sinceTimestamp: BEFORE,
          tokens: [
            mockToken(ASSET_A, SINCE_0),
            mockToken(ASSET_B, SINCE_1),
            mockToken(ASSET_C, SINCE_1),
          ],
        },
      ],
    },
    {
      name: 'ZKswap',
      projectId: ProjectId('zk-swap'),
      bridges: [
        {
          address: HOLDER_B,
          sinceTimestamp: BEFORE,
          tokens: [
            mockToken(ASSET_B, SINCE_0),
            mockToken(ASSET_C, SINCE_1),
            mockToken(ASSET_D, SINCE_1),
          ],
        },
      ],
    },
  ]

  const fakeFindByTimestamp = async (timestamp: UnixTime) => {
    return timestamp.equals(START)
      ? {
          timestamp: START,
          blockNumber: START_BLOCK_NUMBER,
        }
      : {
          timestamp: AFTER,
          blockNumber: AFTER_BLOCK_NUMBER,
        }
  }

  const balanceRepository = mock<BalanceRepository>({
    getByTimestamp: mockFn().returns([]),
    addOrUpdateMany: mockFn().returns([]),
  })

  const multicall = mock<MulticallClient>({
    multicall: mockFn().returns([]),
  })

  const blockNumberRepository = mock<BlockNumberRepository>({
    findByTimestamp: fakeFindByTimestamp,
  })

  const balanceStatusRepository = mock<BalanceStatusRepository>({
    getByConfigHash: async () => [],
    add: async () => Hash256.random(),
  })

  const balanceUpdater = new BalanceUpdater(
    multicall,
    balanceRepository,
    blockNumberRepository,
    balanceStatusRepository,
    [],
    Logger.SILENT,
  )

  describe(BalanceUpdater.prototype.update.name, () => {
    it('integration test', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce([
            {
              timestamp: START,
              holderAddress: HOLDER_A,
              assetId: ASSET_A,
              balance: 100n,
            },
            {
              timestamp: START,
              holderAddress: HOLDER_A,
              assetId: ASSET_B,
              balance: 100n,
            },
            {
              timestamp: START,
              holderAddress: HOLDER_B,
              assetId: ASSET_B,
              balance: 100n,
            },
            {
              timestamp: START,
              holderAddress: HOLDER_B,
              assetId: ASSET_C,
              balance: 100n,
            },
          ])
          .returnsOnce([]),
        addOrUpdateMany: mockFn().returns([]),
      })

      const multicall = mock<MulticallClient>({
        multicall: mockFn()
          .returnsOnce([mockMulticall(100n), mockMulticall(200n)])
          .returnsOnce([
            mockMulticall(1n),
            mockMulticall(2n),
            mockMulticall(3n),
            mockMulticall(4n),
            mockMulticall(5n),
            mockMulticall(6n),
          ]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      const timestamp = [START, AFTER]

      await balanceUpdater.update(timestamp)

      expect(multicall.multicall).toHaveBeenCalledExactlyWith([
        [
          [
            BalanceCall.encode(HOLDER_A, ASSET_C),
            BalanceCall.encode(HOLDER_B, ASSET_D),
          ],
          START_BLOCK_NUMBER,
        ],
        [
          [
            BalanceCall.encode(HOLDER_A, ASSET_A),
            BalanceCall.encode(HOLDER_A, ASSET_B),
            BalanceCall.encode(HOLDER_A, ASSET_C),
            BalanceCall.encode(HOLDER_B, ASSET_B),
            BalanceCall.encode(HOLDER_B, ASSET_C),
            BalanceCall.encode(HOLDER_B, ASSET_D),
          ],
          AFTER_BLOCK_NUMBER,
        ],
      ])

      expect(balanceRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [
          [
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_C,
              timestamp: START,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_D,
              timestamp: START,
              balance: 200n,
            },
          ],
        ],
        [
          [
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_A,
              timestamp: AFTER,
              balance: 1n,
            },
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_B,
              timestamp: AFTER,
              balance: 2n,
            },
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_C,
              timestamp: AFTER,
              balance: 3n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_B,
              timestamp: AFTER,
              balance: 4n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_C,
              timestamp: AFTER,
              balance: 5n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_D,
              timestamp: AFTER,
              balance: 6n,
            },
          ],
        ],
      ])
    })

    it('skip downloading data that is available', async () => {
      const timestamps = [START, AFTER]

      await balanceUpdater.update(timestamps)

      expect(multicall.multicall.calls.length).toEqual(0)

      expect(balanceRepository.addOrUpdateMany.calls.length).toEqual(0)
    })

    it('skips known timestamps', async () => {
      const timestamps = [START, AFTER]

      const balanceStatusRepository = mock<BalanceStatusRepository>({
        getByConfigHash: async () => [START, AFTER],
        add: async () => Hash256.random(),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      await balanceUpdater.update(timestamps)

      expect(balanceStatusRepository.add).toHaveBeenCalledExactlyWith([])
    })
  })

  describe(BalanceUpdater.prototype.getBalancesWhenReady.name, () => {
    const balances: BalanceRecord[] = [
      {
        assetId: AssetId.ETH,
        balance: 1234n,
        holderAddress: EthereumAddress.random(),
        timestamp: START,
      },
    ]

    const balanceRepository = mock<BalanceRepository>({
      getByTimestamp: async () => balances,
    })

    const balanceStatusRepository = mock<BalanceStatusRepository>({
      getByConfigHash: async () => [START],
    })

    it('returns immediately if the data is available', async () => {
      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      await balanceUpdater.update([START])
      const result = await balanceUpdater.getBalancesWhenReady(START)

      expect(result).toEqual(balances)
    })

    it('waits until data is available, then returns', async () => {
      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      let result: unknown = undefined
      void balanceUpdater.getBalancesWhenReady(START, 10).then((value) => {
        result = value
      })

      await setTimeout(20)
      expect(result).toEqual(undefined)

      await balanceUpdater.update([START])

      await waitForExpect(() => {
        expect(result).toEqual(balances)
      })
    })
  })

  describe(BalanceUpdater.prototype.getMissingData.name, () => {
    it('no data in DB', async () => {
      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingData(START)

      expect(result).toEqual([
        {
          holder: HOLDER_A,
          assetId: ASSET_A,
        },
        {
          holder: HOLDER_A,
          assetId: ASSET_B,
        },
        {
          holder: HOLDER_A,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_B,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_D,
        },
      ])
    })

    it('finds missing data', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: mockFn().returns([
          {
            blockNumber: START_BLOCK_NUMBER,
            holderAddress: HOLDER_A,
            assetId: ASSET_A,
            balance: 100n,
          },
          {
            blockNumber: START_BLOCK_NUMBER,
            holderAddress: HOLDER_B,
            assetId: ASSET_B,
            balance: 100n,
          },
        ]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        PROJECTS,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingData(START)

      expect(result).toBeAnArrayWith(
        {
          holder: HOLDER_A,
          assetId: ASSET_B,
        },
        {
          holder: HOLDER_A,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_D,
        },
      )
      expect(result).toBeAnArrayOfLength(4)
    })

    it('blocks before bridge', async () => {
      const projects: ProjectInfo[] = [
        {
          name: 'Arbitrum',
          projectId: ProjectId('arbitrum'),
          bridges: [
            {
              address: HOLDER_A,
              sinceTimestamp: AFTER,
              tokens: [
                mockToken(ASSET_A, SINCE_0),
                mockToken(ASSET_B, SINCE_1),
              ],
            },
          ],
        },
      ]

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        projects,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingData(START)

      expect(result).toEqual([])
    })

    it('blocks before token', async () => {
      const projects: ProjectInfo[] = [
        {
          name: 'Arbitrum',
          projectId: ProjectId('arbitrum'),
          bridges: [
            {
              address: HOLDER_A,
              sinceTimestamp: START,
              tokens: [mockToken(ASSET_A, SINCE_0), mockToken(ASSET_B, AFTER)],
            },
          ],
        },
      ]

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        projects,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingData(START)

      expect(result).toEqual([
        {
          holder: HOLDER_A,
          assetId: ASSET_A,
        },
      ])
    })
  })

  describe(BalanceUpdater.prototype.fetchBalances.name, () => {
    it('queries and parses data from multicall', async () => {
      const multicall = mock<MulticallClient>({
        multicall: async () => [
          mockMulticall(100n),
          mockMulticall(200n),
          mockMulticall(300n),
        ],
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        balanceStatusRepository,
        [],
        Logger.SILENT,
      )

      const metadata = [
        { holder: HOLDER_A, assetId: ASSET_A },
        { holder: HOLDER_B, assetId: ASSET_B },
        { holder: HOLDER_C, assetId: ASSET_C },
      ]

      const result = await balanceUpdater.fetchBalances(metadata, START)

      expect(result).toEqual([
        {
          timestamp: START,
          holderAddress: HOLDER_A,
          assetId: ASSET_A,
          balance: 100n,
        },
        {
          timestamp: START,
          holderAddress: HOLDER_B,
          assetId: ASSET_B,
          balance: 200n,
        },
        {
          timestamp: START,
          holderAddress: HOLDER_C,
          assetId: ASSET_C,
          balance: 300n,
        },
      ])
    })
  })
})

const mockMulticall = (amount: bigint) => ({
  success: true,
  data: Bytes.fromHex('0x' + amount.toString(16).padStart(64, '0')),
})
