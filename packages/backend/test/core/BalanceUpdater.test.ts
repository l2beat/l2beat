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
import { MulticallClient } from '../../src/peripherals/ethereum/MulticallClient'

describe(BalanceUpdater.name, () => {
  const HOLDER_A = EthereumAddress.random()
  const HOLDER_B = EthereumAddress.random()
  const HOLDER_C = EthereumAddress.random()

  const ASSET_A = AssetId('eth-ether')
  const ASSET_B = AssetId('usdc-usd-coin')
  const ASSET_C = AssetId('usdt-tether-usd')

  const START_BLOCK_NUMBER = 123456n

  describe(BalanceUpdater.prototype.fetchBalances.name, () => {
    it('fetch new balances', async () => {
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
        { address: HOLDER_A, asset: ASSET_A },
        { address: HOLDER_B, asset: ASSET_B },
        { address: HOLDER_C, asset: ASSET_C },
      ]

      await balanceUpdater.fetchBalances(metadata, START_BLOCK_NUMBER)

      expect(balanceRepository.addOrUpdate).toHaveBeenCalledExactlyWith([
        [
          [
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
          ],
        ],
      ])
    })
  })

  describe(BalanceUpdater.prototype.getMissingDataByBlock.name, () => {
    it('finds missing data', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getDataBoundaries: mockFn().returnsOnce(
          new Map([
            [
              `${HOLDER_A}-${ASSET_A}`,
              {
                earliestBlockNumber: 1000n,
                latestBlockNumber: 1002n,
              },
            ],
            [
              `${HOLDER_A}-${ASSET_B}`,
              {
                earliestBlockNumber: 1000n,
                latestBlockNumber: 1002n,
              },
            ],
          ])
        ),
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

      const result = await balanceUpdater.getMissingDataByBlock(1001n)

      expect(result).toEqual([
        {
          holder: HOLDER_A,
          assetId: ASSET_C,
        },
      ])
    })

    // Bridge sinceblock is before the blockNumber
    // Token sinceblock is before blockNumber
  })

  describe(BalanceUpdater.prototype.update.name, async () => {
    //TODO
  })

  //       it('E2E', async () => {
  //       const httpClient = new HttpClient()

  //       const alchemyHttpClient = new AlchemyHttpClient(
  //         process.env['ALCHEMY_API_KEY'] as string,
  //         httpClient,
  //         Logger.SILENT
  //       )
  //       const ethereumClient = new EthereumClient(alchemyHttpClient)
  //       const multicall = new MulticallClient(ethereumClient)

  //       const balanceRepository = mock<BalanceRepository>({
  //         addOrUpdate: mockFn().returns([]),
  //       })

  //       const projects: ProjectInfo[] = []

  //       const balanceUpdater = new BalanceUpdater(multicall, balanceRepository, projects)

  //       const result = await balanceUpdater.updateBalances(
  //         MOCK_HOLDERS,
  //         14352593n
  //       )

  //       console.log(result)
  //     })
})
