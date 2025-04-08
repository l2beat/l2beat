import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { CoingeckoQueryService, type QueryResultPoint } from '../../services'
import { CirculatingSupplyProvider } from './CirculatingSupplyProvider'

describe(CirculatingSupplyProvider.name, () => {
  describe(CirculatingSupplyProvider.prototype.getCirculatingSupplies
    .name, () => {
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
        getCirculatingSupplies: mockFn().resolvesToOnce(expectedResult),
      })

      const provider = new CirculatingSupplyProvider(coingeckoQueryService)

      const result = await provider.getCirculatingSupplies(coingeckoId, range)

      expect(
        coingeckoQueryService.getCirculatingSupplies,
      ).toHaveBeenOnlyCalledWith(coingeckoId, range)
      expect(result).toEqual(expectedResult)
    })

    it('propagates errors from CoingeckoQueryService', async () => {
      const coingeckoId = CoingeckoId('ethereum')
      const from = UnixTime(1600000000)
      const to = UnixTime(1700000000)
      const range = { from, to }

      const error = new Error('API rate limit exceeded')

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getCirculatingSupplies: mockFn().rejectsWithOnce(error),
      })

      const provider = new CirculatingSupplyProvider(coingeckoQueryService)

      await expect(
        provider.getCirculatingSupplies(coingeckoId, range),
      ).toBeRejectedWith('API rate limit exceeded')
    })
  })

  describe(CirculatingSupplyProvider.prototype.getAdjustedTo.name, () => {
    it('delegates to CoingeckoQueryService.calculateAdjustedTo', () => {
      const from = 1600000000
      const to = 1700000000

      const provider = new CirculatingSupplyProvider(
        mockObject<CoingeckoQueryService>({}),
      )

      const result = provider.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(from, to)

      expect(result).toEqual(expected)
    })
  })
})
