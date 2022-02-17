import { CoingeckoId, Logger, mock, SimpleDate, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'
import { utils } from 'ethers'

import { PriceService } from '../../../../src/old/services/prices'
import { FetchedPrices } from '../../../../src/old/services/prices/model'
import { CoingeckoQueryService } from '../../../../src/peripherals/coingecko/CoingeckoQueryService'

describe(PriceService.name, () => {
  describe(PriceService.prototype.getPrices.name, () => {
    it('is called with correct parameters', async () => {
      const dates = [
        SimpleDate.fromString('2022-02-14'),
        SimpleDate.fromString('2022-02-15'),
      ]

      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn().returnsOnce(
          dates.map((date) => ({
            value: 100,
            timestamp: new UnixTime(date.toUnixTimestamp()),
            deltaMs: 0,
          }))
        ),
      })
      const priceService = new PriceService(
        coingeckoQueryService,
        Logger.SILENT
      )

      const tokens: TokenInfo[] = [
        {
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          coingeckoId: 'dai',
          decimals: 18,
          sinceBlock: 8928158,
          category: 'stablecoin',
        },
      ]

      await priceService.getPrices(tokens, dates)

      expect(
        coingeckoQueryService.getUsdPriceHistory
      ).toHaveBeenCalledExactlyWith([
        [
          CoingeckoId('dai'),
          new UnixTime(dates[0].toUnixTimestamp()),
          new UnixTime(dates[dates.length - 1].toUnixTimestamp()),
          'daily',
        ],
      ])
    })
    it('three dates and two coins and ether', async () => {
      const dates = [
        SimpleDate.fromString('2022-02-14'),
        SimpleDate.fromString('2022-02-15'),
        SimpleDate.fromString('2022-02-16'),
      ]

      const DAI_PRICE = 200
      const ETH_PRICE = 1234.5678
      const USDC_PRICE = 1

      const coingeckoQueryService = mock<CoingeckoQueryService>({
        getUsdPriceHistory: mockFn()
          .returnsOnce(
            dates.map((date, index) => ({
              value: DAI_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            }))
          )
          .returnsOnce(
            dates.map((date, index) => ({
              value: ETH_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            }))
          )
          .returnsOnce(
            dates.map((date, index) => ({
              value: USDC_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            }))
          ),
      })
      const priceService = new PriceService(
        coingeckoQueryService,
        Logger.SILENT
      )

      const tokens: TokenInfo[] = [
        {
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          coingeckoId: 'dai',
          decimals: 18,
          sinceBlock: 8928158,
          category: 'stablecoin',
        },
        {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          coingeckoId: 'ethereum',
          sinceBlock: 0,
          category: 'ether',
        },
        {
          name: 'USD Coin',
          symbol: 'USDC',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          coingeckoId: 'usd-coin',
          decimals: 6,
          sinceBlock: 6082465,
          category: 'stablecoin',
        },
      ]

      const result = await priceService.getPrices(tokens, dates)

      const expected = new Map<SimpleDate, FetchedPrices>(
        dates.map((date, index) => [
          date,
          {
            token: {
              [tokens[0].address!]: utils.parseUnits(
                (DAI_PRICE + index).toFixed(18 * 2 - tokens[0].decimals),
                18 * 2 - tokens[0].decimals
              ),
              [tokens[2].address!]: utils.parseUnits(
                (USDC_PRICE + index).toFixed(18 * 2 - tokens[2].decimals),
                18 * 2 - tokens[2].decimals
              ),
            },

            eth: utils.parseUnits(
              (ETH_PRICE + index).toFixed(18),
              tokens[1].decimals
            ),
          },
        ])
      )

      expect(result).toEqual(expected)
    })
  })
})
