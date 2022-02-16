import { CoingeckoId, mock, SimpleDate, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'
import { utils } from 'ethers'
import { Logger } from 'ethers/lib/utils'

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
      const logger = mock<Logger>({
        info: mockFn().returns([]),
      })
      const priceService = new PriceService(
        coingeckoQueryService,
        logger as any
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
      const ETH_PRICE = 1000
      const UNI_PRICE = 100

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
              value: UNI_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            }))
          ),
      })
      const logger = mock<Logger>({
        info: mockFn().returns([]),
      })
      const priceService = new PriceService(
        coingeckoQueryService,
        logger as any
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
          name: 'Uniswap',
          symbol: 'UNI',
          address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          coingeckoId: 'uniswap',
          decimals: 18,
          sinceBlock: 10861674,
          category: 'other',
        },
      ]

      const result = await priceService.getPrices(tokens, dates)

      const expected = new Map<SimpleDate, FetchedPrices>(
        dates.map((date, index) => [
          date,
          {
            token: {
              ['0x6B175474E89094C44Da98b954EedeAC495271d0F']: utils.parseUnits(
                (DAI_PRICE + index).toFixed(18 * 2 - 18),
                18 * 2 - 18
              ),
              ['0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984']: utils.parseUnits(
                (UNI_PRICE + index).toFixed(18 * 2 - 18),
                18 * 2 - 18
              ),
            },

            eth: utils.parseUnits((ETH_PRICE + index).toFixed(18), 18),
          },
        ])
      )

      expect(result).toEqual(expected)
    })
  })
})
