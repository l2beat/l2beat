import { CoingeckoQueryService, PriceProvider } from '@l2beat/shared'
import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Configuration } from '../../../tools/uif/multi/types'
import { PriceService } from './PriceService'

describe(PriceService.name, () => {
  describe(PriceService.prototype.fetchPrices.name, () => {
    it('fetches prices and joins them with configurations', async () => {
      const from = new UnixTime(100)
      const to = new UnixTime(300)
      const coingeckoId = CoingeckoId('id')
      const configurations: Configuration<CoingeckoPriceConfigEntry>[] = [
        configuration('a', 100, null),
        configuration('b', 100, 200),
        configuration('c', 100, 400),
      ]

      const priceProvider = mockObject<PriceProvider>({
        getUsdPriceHistoryHourly: async () => [
          coingeckoResponse(100),
          coingeckoResponse(200),
          coingeckoResponse(300),
        ],
      })

      const priceService = new PriceService({
        priceProvider,
      })

      const prices = await priceService.fetchPrices(
        from,
        to,
        coingeckoId,
        configurations,
      )

      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenOnlyCalledWith(
        coingeckoId,
        from,
        to,
      )

      // all for "a" - maxHeight === null
      // two for "b" - maxHeight < to
      // all for "c" - maxHeight > 0
      expect(prices).toEqual([
        price('a', 100),
        price('a', 200),
        price('a', 300),
        price('b', 100),
        price('b', 200),
        price('c', 100),
        price('c', 200),
        price('c', 300),
      ])
    })
  })

  describe(PriceService.prototype.getAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = 0
      const to = 100

      const service = new PriceService({
        priceProvider: mockObject<PriceProvider>({}),
      })

      const result = service.getAdjustedTo(from, to)

      const expected = CoingeckoQueryService.getAdjustedTo(
        new UnixTime(from),
        new UnixTime(to),
      )

      expect(result).toEqual(expected)
    })
  })
})

function configuration(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<CoingeckoPriceConfigEntry> {
  return {
    id,
    properties: mockObject<CoingeckoPriceConfigEntry>({
      coingeckoId: CoingeckoId('id'),
    }),
    minHeight,
    maxHeight,
  }
}

function price(configId: string, timestamp: number) {
  return {
    configId,
    timestamp: new UnixTime(timestamp),
    priceUsd: timestamp, // for the sake of tests simplicity it is the same
  }
}

function coingeckoResponse(timestamp: number) {
  return {
    timestamp: new UnixTime(timestamp),
    value: timestamp, // for the sake of tests simplicity it is the same
    deltaMs: 0,
  }
}
