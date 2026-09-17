import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
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

      const coingeckoQueryService = {
        getUsdPriceHistoryHourly: vi.fn().mockResolvedValueOnce(expectedResult),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getUsdPriceHistoryHourly(
        coingeckoId,
        from,
        to,
      )

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenCalledExactlyOnceWith(coingeckoId, from, to)
      expect(result).toEqual(expectedResult)
    })

    it('propagates errors from CoingeckoQueryService', async () => {
      const coingeckoId = CoingeckoId('ethereum')
      const from = UnixTime(1600000000)
      const to = UnixTime(1700000000)

      const error = new Error('API rate limit exceeded')

      const coingeckoQueryService = {
        getUsdPriceHistoryHourly: vi.fn().mockRejectedValueOnce(error),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      await expect(
        provider.getUsdPriceHistoryHourly(coingeckoId, from, to),
      ).rejects.toThrow('API rate limit exceeded')
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

      const coingeckoQueryService = {
        getLatestMarketData: vi.fn().mockResolvedValueOnce(marketData),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getLatestPrices(coingeckoIds)

      expect(
        coingeckoQueryService.getLatestMarketData,
      ).toHaveBeenCalledExactlyOnceWith(coingeckoIds)
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

      const coingeckoQueryService = {
        getLatestMarketData: vi.fn().mockResolvedValueOnce(marketData),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getLatestPrices(coingeckoIds)

      expect(result).toEqual(expectedResult)
    })

    it('propagates errors from CoingeckoQueryService', async () => {
      const coingeckoIds = [CoingeckoId('ethereum'), CoingeckoId('bitcoin')]
      const error = new Error('Failed to fetch latest prices')

      const coingeckoQueryService = {
        getLatestMarketData: vi.fn().mockRejectedValueOnce(error),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      await expect(provider.getLatestPrices(coingeckoIds)).rejects.toThrow(
        'Failed to fetch latest prices',
      )
    })

    it('handles empty array of coingeckoIds', async () => {
      const coingeckoIds: CoingeckoId[] = []
      const marketData = new Map()
      const expectedResult = new Map()

      const coingeckoQueryService = {
        getLatestMarketData: vi.fn().mockResolvedValueOnce(marketData),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getLatestPrices(coingeckoIds)

      expect(result).toEqual(expectedResult)
    })
  })

  describe(PriceProvider.prototype.getAdjustedTo.name, () => {
    it('delegates to CoingeckoQueryService.calculateAdjustedTo', () => {
      const from = 1600000000
      const to = 1700000000

      const provider = new PriceProvider({} as unknown as CoingeckoQueryService)

      const result = provider.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(
        UnixTime(from),
        UnixTime(to),
      )

      expect(result).toEqual(expected)
    })
  })

  describe(PriceProvider.prototype.getAllCoingeckoIds.name, () => {
    it('delegates to CoingeckoQueryService', async () => {
      const expectedResult = [
        'bitcoin',
        'ethereum',
        'tether',
        'binancecoin',
      ].map(CoingeckoId)

      const coingeckoQueryService = {
        getAllCoingeckoIds: vi.fn().mockResolvedValueOnce(expectedResult),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      const result = await provider.getAllCoingeckoIds()

      expect(
        coingeckoQueryService.getAllCoingeckoIds,
      ).toHaveBeenCalledExactlyOnceWith()
      expect(result).toEqual(expectedResult)
    })

    it('propagates errors from CoingeckoQueryService', async () => {
      const error = new Error('Failed to fetch coin list')

      const coingeckoQueryService = {
        getAllCoingeckoIds: vi.fn().mockRejectedValueOnce(error),
      } as unknown as CoingeckoQueryService

      const provider = new PriceProvider(coingeckoQueryService)

      await expect(provider.getAllCoingeckoIds()).rejects.toThrow(
        'Failed to fetch coin list',
      )
    })
  })
})
