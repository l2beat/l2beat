import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { CoingeckoQueryService, type PriceProvider } from '@l2beat/shared'
import {
  CoingeckoId,
  type CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Configuration } from '../../../tools/uif/multi/types'
import { PriceService } from './PriceService'

describe(PriceService.name, () => {
  describe(PriceService.prototype.getPrices.name, () => {
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
        database: mockObject<Database>(),
        logger: Logger.SILENT,
      })

      const prices = await priceService.getPrices(
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

  describe(PriceService.prototype.fetchPricesWithFallback.name, () => {
    it('returns DB record when PriceProvider fails', async () => {
      const coingeckoId = CoingeckoId('coingecko-id')
      const to = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const from = to.add(-1, 'hours').add(1, 'seconds')
      const configurations = [configuration('id', 1, null)]

      const priceProvider = mockObject<PriceProvider>({
        getUsdPriceHistoryHourly: mockFn().rejectsWith(new Error('error')),
      })
      const priceTable = mockObject<Database['price']>({
        getLatestPrice: async () => price('id', to.toNumber()),
      })

      const service = new PriceService({
        priceProvider,
        database: mockObject<Database>({ price: priceTable }),
        logger: Logger.SILENT,
      })

      const result = await service.fetchPricesWithFallback(
        coingeckoId,
        from,
        to,
        configurations,
      )

      expect(result).toEqual([{ value: to.toNumber(), timestamp: to }])
      expect(priceProvider.getUsdPriceHistoryHourly).toHaveBeenOnlyCalledWith(
        coingeckoId,
        from,
        to,
      )
      expect(priceTable.getLatestPrice).toHaveBeenOnlyCalledWith(['id'])
    })

    it('works only for latest hour', async () => {
      const coingeckoId = CoingeckoId('coingecko-id')
      const to = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))
      const from = to.add(-365, 'days')
      const configurations = [configuration('id', 1, null)]

      const priceProvider = mockObject<PriceProvider>({
        getUsdPriceHistoryHourly: mockFn().rejectsWith(new Error('error')),
      })

      const service = new PriceService({
        priceProvider,
        database: mockObject<Database>({}),
        logger: Logger.SILENT,
      })

      await expect(
        async () =>
          await service.fetchPricesWithFallback(
            coingeckoId,
            from,
            to,
            configurations,
          ),
      ).toBeRejectedWith('error')
    })
  })

  describe(PriceService.prototype.calculateAdjustedTo.name, () => {
    it('adjust range for coingecko hourly query range', () => {
      const from = 0
      const to = 100

      const service = new PriceService({
        priceProvider: mockObject<PriceProvider>({}),
        database: mockObject<Database>(),
        logger: Logger.SILENT,
      })

      const result = service.calculateAdjustedTo(from, to)

      const expected = CoingeckoQueryService.calculateAdjustedTo(
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
  }
}
