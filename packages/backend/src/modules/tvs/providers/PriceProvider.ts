import { tokenList } from '@l2beat/config'
import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import { priceIdToCoingeckoId } from './priceIdToCoingeckoId'

export class PriceProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getPrice(priceId: string, timestamp: UnixTime): Promise<number> {
    const coingeckoId = priceIdToCoingeckoId(priceId, tokenList)

    const prices = await this.client.getUsdPriceHistoryHourly(
      CoingeckoId(coingeckoId),
      timestamp,
      timestamp,
    )
    assert(
      prices.length === 1,
      `${priceId}: Too many prices fetched ${JSON.stringify(prices)}`,
    )

    return prices[0].value
  }
}
