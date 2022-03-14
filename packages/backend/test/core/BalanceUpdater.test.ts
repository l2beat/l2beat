import {
  AssetId,
  Bytes,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
} from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { BalanceUpdater } from '../../src/core/BalanceUpdater'
import { ProjectInfo } from '../../src/model/ProjectInfo'
import { BalanceRepository } from '../../src/peripherals/database/BalanceRepository'
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

  const START_BLOCK_NUMBER = 10000n

  const PROJECTS: ProjectInfo[] = [
    {
      name: 'Arbitrum',
      bridges: [
        {
          address: HOLDER_A.toString(),
          sinceBlock: Number(START_BLOCK_NUMBER - 100n),
          tokens: [
            {
              id: ASSET_A,
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
              coingeckoId: CoingeckoId('ethereum'),
              sinceBlock: 0,
              category: 'ether',
            },
            {
              id: ASSET_B,
              name: 'USD Coin',
              coingeckoId: CoingeckoId('usd-coin'),
              address: EthereumAddress(
                '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
              ),
              symbol: 'USDC',
              decimals: 6,
              sinceBlock: 800,
              category: 'stablecoin',
            },
            {
              id: ASSET_C,
              name: 'Tether USD',
              coingeckoId: CoingeckoId('tether'),
              address: EthereumAddress(
                '0xdAC17F958D2ee523a2206206994597C13D831ec7'
              ),
              symbol: 'USDT',
              decimals: 6,
              sinceBlock: 800,
              category: 'stablecoin',
            },
          ],
        },
      ],
    },
    {
      name: 'Zkswap',
      bridges: [
        {
          address: HOLDER_B.toString(),
          sinceBlock: Number(START_BLOCK_NUMBER - 100n),
          tokens: [
            {
              id: ASSET_B,
              name: 'USD Coin',
              coingeckoId: CoingeckoId('usd-coin'),
              address: EthereumAddress(
                '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
              ),
              symbol: 'USDC',
              decimals: 6,
              sinceBlock: 800,
              category: 'stablecoin',
            },
            {
              id: ASSET_C,
              name: 'Tether USD',
              coingeckoId: CoingeckoId('tether'),
              address: EthereumAddress(
                '0xdAC17F958D2ee523a2206206994597C13D831ec7'
              ),
              symbol: 'USDT',
              decimals: 6,
              sinceBlock: 800,
              category: 'stablecoin',
            },
            {
              id: ASSET_D,
              name: '0x Protocol Token',
              coingeckoId: CoingeckoId('0x'),
              address: EthereumAddress(
                '0xE41d2489571d322189246DaFA5ebDe1F4699F498'
              ),
              symbol: 'ZRX',
              decimals: 18,
              sinceBlock: 800,
              category: 'other',
            },
          ],
        },
      ],
    },
  ]

  const BALANCE_100_RESPONSE = {
    success: true,
    data: Bytes.fromHex(
      '0x0000000000000000000000000000000000000000000000000000000000000064'
    ),
  }

  describe(BalanceUpdater.prototype.update.name, () => {
    it('integration test', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn()
          .returnsOnce([
            {
              blockNumber: START_BLOCK_NUMBER,
              holderAddress: HOLDER_A,
              assetId: ASSET_A,
              balance: 100n,
            },
            {
              blockNumber: START_BLOCK_NUMBER,
              holderAddress: HOLDER_A,
              assetId: ASSET_B,
              balance: 100n,
            },
            {
              blockNumber: START_BLOCK_NUMBER,
              holderAddress: HOLDER_B,
              assetId: ASSET_B,
              balance: 100n,
            },
            {
              blockNumber: START_BLOCK_NUMBER,
              holderAddress: HOLDER_B,
              assetId: ASSET_C,
              balance: 100n,
            },
          ])
          .returnsOnce([]),
        addOrUpdate: mockFn().returns([]),
      })

      const multicall = mock<MulticallClient>({
        multicall: mockFn()
          .returnsOnce([BALANCE_100_RESPONSE, BALANCE_100_RESPONSE])
          .returnsOnce([
            BALANCE_100_RESPONSE,
            BALANCE_100_RESPONSE,
            BALANCE_100_RESPONSE,
            BALANCE_100_RESPONSE,
            BALANCE_100_RESPONSE,
            BALANCE_100_RESPONSE,
          ]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        PROJECTS,
        Logger.SILENT
      )

      const blocks = [START_BLOCK_NUMBER, START_BLOCK_NUMBER + 1000n]

      await balanceUpdater.update(blocks)

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
          START_BLOCK_NUMBER + 1000n,
        ],
      ])

      expect(balanceRepository.addOrUpdate).toHaveBeenCalledExactlyWith([
        [
          [
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_C,
              blockNumber: START_BLOCK_NUMBER,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_D,
              blockNumber: START_BLOCK_NUMBER,
              balance: 100n,
            },
          ],
        ],
        [
          [
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_A,
              blockNumber: START_BLOCK_NUMBER + 1000n,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_B,
              blockNumber: START_BLOCK_NUMBER + 1000n,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_C,
              blockNumber: START_BLOCK_NUMBER + 1000n,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_B,
              blockNumber: START_BLOCK_NUMBER + 1000n,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_C,
              blockNumber: START_BLOCK_NUMBER + 1000n,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_D,
              blockNumber: START_BLOCK_NUMBER + 1000n,
              balance: 100n,
            },
          ],
        ],
      ])
    })

    it('skip processed blocks', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn().returns([]),
        addOrUpdate: mockFn().returns([]),
      })

      const multicall = mock<MulticallClient>({
        multicall: mockFn().returns([]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        [],
        Logger.SILENT
      )

      const blocks = [START_BLOCK_NUMBER, START_BLOCK_NUMBER + 1000n]

      await balanceUpdater.update(blocks)
      await balanceUpdater.update(blocks)

      expect(multicall.multicall).toHaveBeenCalledExactlyWith([
        [[], START_BLOCK_NUMBER],
        [[], START_BLOCK_NUMBER + 1000n],
      ])

      expect(balanceRepository.addOrUpdate).toHaveBeenCalledExactlyWith([
        [[]],
        [[]],
      ])
    })
  })

  describe(BalanceUpdater.prototype.getMissingDataByBlock.name, () => {
    it('no data in DB', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn().returns([]),
      })
      const multicall = mock<MulticallClient>({
        multicall: mockFn().returns([]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        PROJECTS,
        Logger.SILENT
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER
      )

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
        getByBlock: mockFn().returns([
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
      const multicall = mock<MulticallClient>({
        multicall: mockFn().returns([]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        PROJECTS,
        Logger.SILENT
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER
      )

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
        }
      )
      expect(result).toBeAnArrayOfLength(4)
    })

    it('blocks before bridge', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn().returns([]),
      })
      const multicall = mock<MulticallClient>({
        multicall: mockFn().returns([]),
      })

      const projects: ProjectInfo[] = [
        {
          name: 'Arbitrum',
          bridges: [
            {
              address: HOLDER_A.toString(),
              sinceBlock: Number(START_BLOCK_NUMBER + 1000n),
              tokens: [
                {
                  id: ASSET_A,
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                  coingeckoId: CoingeckoId('ethereum'),
                  sinceBlock: 0,
                  category: 'ether',
                },
                {
                  id: ASSET_B,
                  name: 'USD Coin',
                  coingeckoId: CoingeckoId('usd-coin'),
                  address: EthereumAddress(
                    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                  ),
                  symbol: 'USDC',
                  decimals: 6,
                  sinceBlock: 800,
                  category: 'stablecoin',
                },
              ],
            },
          ],
        },
      ]

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        projects,
        Logger.SILENT
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER
      )

      expect(result).toEqual([])
    })

    it('blocks before token', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn().returns([]),
      })
      const multicall = mock<MulticallClient>({
        multicall: mockFn().returns([]),
      })

      const projects: ProjectInfo[] = [
        {
          name: 'Arbitrum',
          bridges: [
            {
              address: HOLDER_A.toString(),
              sinceBlock: 999,
              tokens: [
                {
                  id: ASSET_A,
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                  coingeckoId: CoingeckoId('ethereum'),
                  sinceBlock: 0,
                  category: 'ether',
                },
                {
                  id: ASSET_B,
                  name: 'USD Coin',
                  coingeckoId: CoingeckoId('usd-coin'),
                  address: EthereumAddress(
                    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                  ),
                  symbol: 'USDC',
                  decimals: 6,
                  sinceBlock: Number(START_BLOCK_NUMBER + 1000n),
                  category: 'stablecoin',
                },
              ],
            },
          ],
        },
      ]

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        projects,
        Logger.SILENT
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER
      )

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
        multicall: mockFn().returnsOnce([
          {
            success: true,
            data: Bytes.fromHex(
              '0x0000000000000000000000000000000000000000000000000000000000000064'
            ),
          },
          {
            success: true,
            data: Bytes.fromHex(
              '0x0000000000000000000000000000000000000000000000000000000000000064'
            ),
          },
          {
            success: true,
            data: Bytes.fromHex(
              '0x0000000000000000000000000000000000000000000000000000000000000064'
            ),
          },
        ]),
      })
      const balanceRepository = mock<BalanceRepository>({
        addOrUpdate: mockFn().returns([]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        [],
        Logger.SILENT
      )

      const metadata = [
        { holder: HOLDER_A, assetId: ASSET_A },
        { holder: HOLDER_B, assetId: ASSET_B },
        { holder: HOLDER_C, assetId: ASSET_C },
      ]

      const result = await balanceUpdater.fetchBalances(
        metadata,
        START_BLOCK_NUMBER
      )

      expect(result).toEqual([
        {
          holderAddress: HOLDER_A,
          assetId: ASSET_A,
          balance: BigInt(100),
          blockNumber: START_BLOCK_NUMBER,
        },
        {
          holderAddress: HOLDER_B,
          assetId: ASSET_B,
          balance: BigInt(100),
          blockNumber: START_BLOCK_NUMBER,
        },
        {
          holderAddress: HOLDER_C,
          assetId: ASSET_C,
          balance: BigInt(100),
          blockNumber: START_BLOCK_NUMBER,
        },
      ])
    })
  })
})
