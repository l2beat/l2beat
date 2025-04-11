import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { CoingeckoQueryService, type QueryResultPoint } from '../../services'
import { PriceProvider } from './PriceProvider'

describe(PriceProvider.name, () => {
  describe(PriceProvider.prototype.getUsdPriceHistoryHourly.name, () => {
    it('delegates to CoingeckoQueryService', async () => {
      const coingeckoId = CoingeckoId('ethereum')
      const from = UnixTime(1600000000)
      const to = UnixTime(1700000000)

      const expectedResult: QueryResultPoint[] = [
        { timestamp: UnixTime(1600000000), value: 350.75 },
        { timestamp: UnixTime(1650000000), value: 420.69 },
        { timestamp: UnixTime(1700000000), value: 500.25 },
      ]

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: mockFn().resolvesToOnce(expectedResult),
      })

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getUsdPriceHistoryHourly(
        coingeckoId,
        from,
        to,
      )

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenOnlyCalledWith(coingeckoId, from, to)
      expect(result).toEqual(expectedResult)
    })

    it('propagates errors from CoingeckoQueryService', async () => {
      const coingeckoId = CoingeckoId('ethereum')
      const from = UnixTime(1600000000)
      const to = UnixTime(1700000000)

      const error = new Error('API rate limit exceeded')

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: mockFn().rejectsWithOnce(error),
      })

      const provider = new PriceProvider(coingeckoQueryService)

      await expect(
        provider.getUsdPriceHistoryHourly(coingeckoId, from, to),
      ).toBeRejectedWith('API rate limit exceeded')
    })
  })

  describe(PriceProvider.prototype.getLatestPrices.name, () => {
    it('transforms market data into price map', async () => {
      const coingeckoIds = [CoingeckoId('ethereum'), CoingeckoId('bitcoin')]

      const marketData = new Map([
        ['ethereum', { price: 1800.5, circulating: 120000000 }],
        ['bitcoin', { price: 30000.75, circulating: 19000000 }],
      ])

      const expectedResult = new Map([
        ['ethereum', 1800.5],
        ['bitcoin', 30000.75],
      ])

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getLatestMarketData: mockFn().resolvesToOnce(marketData),
      })

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getLatestPrices(coingeckoIds)

      expect(
        coingeckoQueryService.getLatestMarketData,
      ).toHaveBeenOnlyCalledWith(coingeckoIds)
      expect(result).toEqual(expectedResult)
    })

    it('handles zero prices correctly', async () => {
      const coingeckoIds = [
        CoingeckoId('ethereum'),
        CoingeckoId('unknown-token'),
      ]

      const marketData = new Map([
        ['ethereum', { price: 1800.5, circulating: 120000000 }],
        ['unknown-token', { price: 0, circulating: 0 }],
      ])

      const expectedResult = new Map([
        ['ethereum', 1800.5],
        ['unknown-token', 0],
      ])

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getLatestMarketData: mockFn().resolvesToOnce(marketData),
      })

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getLatestPrices(coingeckoIds)

      expect(result).toEqual(expectedResult)
    })

    it('propagates errors from CoingeckoQueryService', async () => {
      const coingeckoIds = [CoingeckoId('ethereum'), CoingeckoId('bitcoin')]
      const error = new Error('Failed to fetch latest prices')

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getLatestMarketData: mockFn().rejectsWithOnce(error),
      })

      const provider = new PriceProvider(coingeckoQueryService)

      await expect(provider.getLatestPrices(coingeckoIds)).toBeRejectedWith(
        'Failed to fetch latest prices',
      )
    })

    it('handles empty array of coingeckoIds', async () => {
      const coingeckoIds: CoingeckoId[] = []
      const marketData = new Map()
      const expectedResult = new Map()

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getLatestMarketData: mockFn().resolvesToOnce(marketData),
      })

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getLatestPrices(coingeckoIds)

      expect(result).toEqual(expectedResult)
    })
  })

  describe(PriceProvider.prototype.getAdjustedTo.name, () => {
    it('delegates to CoingeckoQueryService.calculateAdjustedTo', () => {
      const from = 1600000000
      const to = 1700000000

      const provider = new PriceProvider(mockObject<CoingeckoQueryService>({}))

      const result = provider.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(
        UnixTime(from),
        UnixTime(to),
      )

      expect(result).toEqual(expected)
    })
  })
})
