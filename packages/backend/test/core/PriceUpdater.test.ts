import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  UnixTime,
} from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { PriceUpdater } from '../../src/core/PriceUpdater'
import { Token } from '../../src/model'
import { CoingeckoQueryService } from '../../src/peripherals/coingecko/CoingeckoQueryService'
import { PriceRepository } from '../../src/peripherals/database/PriceRepository'

describe(PriceUpdater.name, () => {
  describe(PriceUpdater.prototype.updateTokenPrice.name, () => {
    it('no new prices', async () => {
      const now = UnixTime.now()

      const coingeckoQS = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([]),
      })

      const latestKnownDate = now.add(-3, 'hours')
      const priceRepository = mock<PriceRepository>({
        getLatestKnownDateByToken: mockFn().returns(latestKnownDate),
      })
      const minTimestamp = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const tokens: Token[] = [
        {
          id: AssetId('uni-uniswap'),
          address: EthereumAddress(
            '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
          ),
          coingeckoId: CoingeckoId('uniswap'),
          symbol: 'UNI',
          decimals: 18,
        },
      ]

      const priceUpdater = new PriceUpdater(
        coingeckoQS,
        priceRepository,
        tokens,
        minTimestamp,
        Logger.SILENT
      )

      await priceUpdater.updateTokenPrice(tokens[0])

      expect(
        priceRepository.getLatestKnownDateByToken
      ).toHaveBeenCalledExactlyWith([[tokens[0].coingeckoId]])

      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
        [
          tokens[0].coingeckoId,
          latestKnownDate.toStartOf('hour'),
          now.toStartOf('hour'),
          'hourly',
        ],
      ])
    })

    it('new prices', async () => {
      const now = UnixTime.now()

      const coingeckoQS = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce([
          {
            value: 100,
            timestamp: now.add(-2, 'hours'),
            deltaMs: 0,
          },
          {
            value: 120,
            timestamp: now.add(-1, 'hours'),
            deltaMs: 0,
          },
        ]),
      })
      const latestKnownDate = now.add(-3, 'hours')
      const priceRepository = mock<PriceRepository>({
        getLatestKnownDateByToken: mockFn().returns(latestKnownDate),
        addOrUpdate: mockFn().returns({}),
      })
      const minTimestamp = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
      const tokens: Token[] = [
        {
          id: AssetId('uni-uniswap'),
          address: EthereumAddress(
            '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
          ),
          coingeckoId: CoingeckoId('uniswap'),
          symbol: 'UNI',
          decimals: 18,
        },
      ]

      const priceUpdater = new PriceUpdater(
        coingeckoQS,
        priceRepository,
        tokens,
        minTimestamp,
        Logger.SILENT
      )

      await priceUpdater.updateTokenPrice(tokens[0])
      expect(
        priceRepository.getLatestKnownDateByToken
      ).toHaveBeenCalledExactlyWith([[tokens[0].coingeckoId]])

      expect(coingeckoQS.getUsdPriceHistory).toHaveBeenCalledExactlyWith([
        [
          tokens[0].coingeckoId,
          latestKnownDate.toStartOf('hour'),
          now.toStartOf('hour'),
          'hourly',
        ],
      ])

      expect(priceRepository.addOrUpdate).toHaveBeenCalledExactlyWith([
        [
          [
            {
              timestamp: now.add(-2, 'hours'),
              priceUsd: 100,
              coingeckoId: tokens[0].coingeckoId,
            },
            {
              timestamp: now.add(-1, 'hours'),
              priceUsd: 120,
              coingeckoId: tokens[0].coingeckoId,
            },
          ],
        ],
      ])
    })
  })
})
