import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  SimpleDate,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'
import { utils } from 'ethers'

import { AsyncCache } from '../../../../src/old/services/AsyncCache'
import { PriceService } from '../../../../src/old/services/prices'
import { PriceSnapshot } from '../../../../src/old/services/prices/model'
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
          })),
        ),
      })
      const asyncCache = mock<AsyncCache>({
        get: mockFn().returnsOnce(undefined),
        set: mockFn().returns([]),
      })
      const priceService = new PriceService(
        asyncCache,
        coingeckoQueryService,
        Logger.SILENT,
      )

      const TOKENS: TokenInfo[] = [
        {
          id: AssetId('dai-dai-stablecoin'),
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          address: EthereumAddress(
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ),
          coingeckoId: CoingeckoId('dai'),
          decimals: 18,
          sinceBlock: 8928158,
          category: 'stablecoin',
        },
      ]

      await priceService.getPrices(TOKENS, dates)

      expect(
        coingeckoQueryService.getUsdPriceHistory,
      ).toHaveBeenCalledExactlyWith([
        [
          CoingeckoId('dai'),
          new UnixTime(dates[0].toUnixTimestamp()).add(-7, 'days'),
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
            })),
          )
          .returnsOnce(
            dates.map((date, index) => ({
              value: ETH_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            })),
          )
          .returnsOnce(
            dates.map((date, index) => ({
              value: USDC_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            })),
          ),
      })
      const asyncCache = mock<AsyncCache>({
        get: mockFn().returns(undefined),
        set: mockFn().returns([]),
      })
      const priceService = new PriceService(
        asyncCache,
        coingeckoQueryService,
        Logger.SILENT,
      )

      const TOKENS: TokenInfo[] = [
        {
          id: AssetId('dai-dai-stablecoin'),
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          address: EthereumAddress(
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          ),
          coingeckoId: CoingeckoId('dai'),
          decimals: 18,
          sinceBlock: 8928158,
          category: 'stablecoin',
        },
        {
          id: AssetId('eth-ether'),
          name: 'Ether',
          symbol: 'ETH',
          coingeckoId: CoingeckoId('ethereum'),
          decimals: 18,
          sinceBlock: 0,
          category: 'ether',
        },
        {
          id: AssetId('usdc-usd-coin'),
          name: 'USD Coin',
          symbol: 'USDC',
          address: EthereumAddress(
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          ),
          coingeckoId: CoingeckoId('usdc'),
          decimals: 6,
          sinceBlock: 6082465,
          category: 'stablecoin',
        },
      ]

      const result = await priceService.getPrices(TOKENS, dates)

      const expected = new Map<SimpleDate, PriceSnapshot>(
        dates.map((date, index) => [
          date,
          {
            token: {
              [TOKENS[0].address!.toString()]: utils.parseUnits(
                (DAI_PRICE + index).toFixed(18 * 2 - TOKENS[0].decimals),
                18 * 2 - TOKENS[0].decimals,
              ),
              [TOKENS[2].address!.toString()]: utils.parseUnits(
                (USDC_PRICE + index).toFixed(18 * 2 - TOKENS[2].decimals),
                18 * 2 - TOKENS[2].decimals,
              ),
            },

            eth: utils.parseUnits(
              (ETH_PRICE + index).toFixed(18),
              TOKENS[1].decimals,
            ),
          },
        ]),
      )

      expect(result).toEqual(expected)
    })

    describe('caching', () => {
      const TOKENS: TokenInfo[] = [
        {
          id: AssetId('uni-uniswap'),
          name: 'Uniswap',
          symbol: 'UNI',
          address: EthereumAddress(
            '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          ),
          coingeckoId: CoingeckoId('uniswap'),
          decimals: 18,
          sinceBlock: 10861674,
          category: 'other',
        },
      ]
      const UNI_PRICE = 200

      it('all from cache', async () => {
        const dates = [
          SimpleDate.fromString('2022-02-14'),
          SimpleDate.fromString('2022-02-15'),
          SimpleDate.fromString('2022-02-16'),
        ]

        const asyncCache = mock<AsyncCache>({
          get: mockFn()
            .returnsOnce(UNI_PRICE)
            .returnsOnce(UNI_PRICE + 1)
            .returnsOnce(UNI_PRICE + 2),
          set: mockFn().returns([]),
        })

        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returns(undefined),
        })

        const priceService = new PriceService(
          asyncCache,
          coingeckoQueryService,
          Logger.SILENT,
        )

        await priceService.getPrices(TOKENS, dates)

        expect(asyncCache.get).toHaveBeenCalledExactlyWith([
          [
            `price-${TOKENS[0].coingeckoId}-${dates[0].toString()}`,
            expect.a(Function as any),
          ],
          [
            `price-${TOKENS[0].coingeckoId}-${dates[1].toString()}`,
            expect.a(Function as any),
          ],
          [
            `price-${TOKENS[0].coingeckoId}-${dates[2].toString()}`,
            expect.a(Function as any),
          ],
        ])

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenCalledExactlyWith([])

        expect(asyncCache.set).toHaveBeenCalledExactlyWith([])
      })

      it('all from API', async () => {
        const dates = [
          SimpleDate.fromString('2022-02-14'),
          SimpleDate.fromString('2022-02-15'),
          SimpleDate.fromString('2022-02-16'),
        ]

        const UNI_PRICE = 200

        const asyncCache = mock<AsyncCache>({
          get: mockFn().returnsOnce(undefined),
          set: mockFn().returns([]),
        })

        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returnsOnce(
            dates.map((date, index) => ({
              value: UNI_PRICE + index,
              timestamp: new UnixTime(date.toUnixTimestamp()),
              deltaMs: 0,
            })),
          ),
        })

        const priceService = new PriceService(
          asyncCache,
          coingeckoQueryService,
          Logger.SILENT,
        )

        await priceService.getPrices(TOKENS, dates)

        expect(asyncCache.get).toHaveBeenCalledExactlyWith([
          [
            `price-${TOKENS[0].coingeckoId}-${dates[0].toString()}`,
            expect.a(Function as any),
          ],
        ])

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenCalledExactlyWith([
          [
            TOKENS[0].coingeckoId,
            new UnixTime(dates[0].toUnixTimestamp()).add(-7, 'days'),
            new UnixTime(dates[dates.length - 1].toUnixTimestamp()),
            'daily',
          ],
        ])

        expect(asyncCache.set).toHaveBeenCalledExactlyWith([
          [
            `price-${TOKENS[0].coingeckoId}-${dates[0].toString()}`,
            UNI_PRICE,
            expect.a(Function as any),
          ],
          [
            `price-${TOKENS[0].coingeckoId}-${dates[1].toString()}`,
            UNI_PRICE + 1,
            expect.a(Function as any),
          ],
          [
            `price-${TOKENS[0].coingeckoId}-${dates[2].toString()}`,
            UNI_PRICE + 2,
            expect.a(Function as any),
          ],
        ])
      })

      it('hybrid', async () => {
        const dates = [
          SimpleDate.fromString('2022-02-14'),
          SimpleDate.fromString('2022-02-15'),
          SimpleDate.fromString('2022-02-16'),
        ]

        const asyncCache = mock<AsyncCache>({
          get: mockFn()
            .returnsOnce(UNI_PRICE)
            .returnsOnce(UNI_PRICE + 1)
            .returnsOnce(undefined),
          set: mockFn().returns([]),
        })

        const coingeckoQueryService = mock<CoingeckoQueryService>({
          getUsdPriceHistory: mockFn().returnsOnce([
            {
              value: UNI_PRICE + 2,
              timestamp: new UnixTime(
                dates[dates.length - 1].toUnixTimestamp(),
              ),
              deltaMs: 0,
            },
          ]),
        })

        const priceService = new PriceService(
          asyncCache,
          coingeckoQueryService,
          Logger.SILENT,
        )

        await priceService.getPrices(TOKENS, dates)

        expect(asyncCache.get).toHaveBeenCalledExactlyWith([
          [
            `price-${TOKENS[0].coingeckoId}-${dates[0].toString()}`,
            expect.a(Function as any),
          ],
          [
            `price-${TOKENS[0].coingeckoId}-${dates[1].toString()}`,
            expect.a(Function as any),
          ],
          [
            `price-${TOKENS[0].coingeckoId}-${dates[2].toString()}`,
            expect.a(Function as any),
          ],
        ])

        expect(
          coingeckoQueryService.getUsdPriceHistory,
        ).toHaveBeenCalledExactlyWith([
          [
            TOKENS[0].coingeckoId,
            new UnixTime(dates[dates.length - 1].toUnixTimestamp()).add(
              -7,
              'days',
            ),
            new UnixTime(dates[dates.length - 1].toUnixTimestamp()),
            'daily',
          ],
        ])

        expect(asyncCache.set).toHaveBeenCalledExactlyWith([
          [
            `price-${TOKENS[0].coingeckoId}-${dates[2].toString()}`,
            UNI_PRICE + 2,
            expect.a(Function as any),
          ],
        ])
      })
    })
  })
})
