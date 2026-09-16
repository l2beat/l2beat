import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { CoingeckoQueryService, type QueryResultPoint } from '../../services'
import { CirculatingSupplyProvider } from './CirculatingSupplyProvider'

describe(CirculatingSupplyProvider.name, () => {
  describe(
    CirculatingSupplyProvider.prototype.getCirculatingSupplies.name,
    () => {
      it('delegates to CoingeckoQueryService', async () => {
        const coingeckoId = CoingeckoId('ethereum')
        const from = UnixTime(1600000000)
        const to = UnixTime(1700000000)
        const range = { from, to }

        const expectedResult: QueryResultPoint[] = [
          { timestamp: UnixTime(1600000000), value: 100000000 },
          { timestamp: UnixTime(1650000000), value: 110000000 },
          { timestamp: UnixTime(1700000000), value: 120000000 },
        ]

        const coingeckoQueryService = mockObject<CoingeckoQueryService>({
          getCirculatingSupplies: vi.fn().mockResolvedValueOnce(expectedResult),
        })

        const provider = new CirculatingSupplyProvider(coingeckoQueryService)

        const result = await provider.getCirculatingSupplies(coingeckoId, range)

        expect(
          coingeckoQueryService.getCirculatingSupplies,
        ).toHaveBeenCalledExactlyOnceWith(coingeckoId, range)
        expect(result).toStrictEqual(expectedResult)
      })

      it('propagates errors from CoingeckoQueryService', async () => {
        const coingeckoId = CoingeckoId('ethereum')
        const from = UnixTime(1600000000)
        const to = UnixTime(1700000000)
        const range = { from, to }

        const error = new Error('API rate limit exceeded')

        const coingeckoQueryService = mockObject<CoingeckoQueryService>({
          getCirculatingSupplies: vi.fn().mockRejectedValueOnce(error),
        })

        const provider = new CirculatingSupplyProvider(coingeckoQueryService)

        await expect(
          provider.getCirculatingSupplies(coingeckoId, range),
        ).rejects.toThrow('API rate limit exceeded')
      })
    },
  )

  describe(
    CirculatingSupplyProvider.prototype.getLatestCirculatingSupplies.name,
    () => {
      it('transforms market data to a map of circulating supplies', async () => {
        const coingeckoIds = [CoingeckoId('ethereum'), CoingeckoId('bitcoin')]

        const marketData = new Map<string, { circulating: number }>([
          ['ethereum', { circulating: 120000000 }],
          ['bitcoin', { circulating: 19000000 }],
        ])

        const expectedResult = new Map<string, number>([
          ['ethereum', 120000000],
          ['bitcoin', 19000000],
        ])

        const coingeckoQueryService = mockObject<CoingeckoQueryService>({
          getLatestMarketData: vi.fn().mockResolvedValueOnce(marketData),
        })

        const provider = new CirculatingSupplyProvider(coingeckoQueryService)

        const result = await provider.getLatestCirculatingSupplies(coingeckoIds)

        expect(
          coingeckoQueryService.getLatestMarketData,
        ).toHaveBeenCalledExactlyOnceWith(coingeckoIds)
        expect(result).toStrictEqual(expectedResult)
      })

      it('handles empty market data', async () => {
        const coingeckoIds = [CoingeckoId('ethereum'), CoingeckoId('bitcoin')]

        const marketData = new Map<string, { circulating: number }>()
        const expectedResult = new Map<string, number>()

        const coingeckoQueryService = mockObject<CoingeckoQueryService>({
          getLatestMarketData: vi.fn().mockResolvedValueOnce(marketData),
        })

        const provider = new CirculatingSupplyProvider(coingeckoQueryService)

        const result = await provider.getLatestCirculatingSupplies(coingeckoIds)

        expect(result).toStrictEqual(expectedResult)
      })

      it('propagates errors from CoingeckoQueryService', async () => {
        const coingeckoIds = [CoingeckoId('ethereum'), CoingeckoId('bitcoin')]

        const error = new Error('API rate limit exceeded')

        const coingeckoQueryService = mockObject<CoingeckoQueryService>({
          getLatestMarketData: vi.fn().mockRejectedValueOnce(error),
        })

        const provider = new CirculatingSupplyProvider(coingeckoQueryService)

        await expect(
          provider.getLatestCirculatingSupplies(coingeckoIds),
        ).rejects.toThrow('API rate limit exceeded')
      })
    },
  )

  describe(CirculatingSupplyProvider.prototype.getAdjustedTo.name, () => {
    it('delegates to CoingeckoQueryService.calculateAdjustedTo', () => {
      const from = 1600000000
      const to = 1700000000

      const provider = new CirculatingSupplyProvider(
        mockObject<CoingeckoQueryService>({}),
      )

      const result = provider.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(from, to)

      expect(result).toStrictEqual(expected)
    })
  })
})
