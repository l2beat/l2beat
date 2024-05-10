import { CoingeckoQueryService } from '@l2beat/shared'
import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { UpdateConfiguration } from '../../../tools/uif/multi/types'
import { PriceService } from './PriceService'

describe(PriceService.name, () => {
  describe(PriceService.prototype.fetchPrices.name, () => {
    it('fetches prices and joins them with configurations', async () => {
      const from = new UnixTime(100)
      const to = new UnixTime(300)
      const coingeckoId = CoingeckoId('id')
      const configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[] = [
        update('a', 100, null),
        update('b', 100, 200),
        update('c', 100, 400),
      ]

      const coingeckoQueryService = mockObject<CoingeckoQueryService>({
        getUsdPriceHistoryHourly: async () => [
          coingeckoResponse(100),
          coingeckoResponse(200),
          coingeckoResponse(300),
        ],
      })

      const priceService = new PriceService({ coingeckoQueryService })

      const prices = await priceService.fetchPrices(
        from,
        to,
        coingeckoId,
        configurations,
      )

      expect(
        coingeckoQueryService.getUsdPriceHistoryHourly,
      ).toHaveBeenOnlyCalledWith(coingeckoId, from, to, undefined)

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
})

function update(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): UpdateConfiguration<CoingeckoPriceConfigEntry> {
  return {
    id,
    properties: mockObject<CoingeckoPriceConfigEntry>({
      coingeckoId: CoingeckoId('id'),
    }),
    minHeight,
    maxHeight,
    hasData: false, // not important here
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
