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
