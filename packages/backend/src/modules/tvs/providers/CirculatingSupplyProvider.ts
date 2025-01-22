import { tokenList } from '@l2beat/config'
import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import { priceIdToCoingeckoId } from './priceIdToCoingeckoId'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupply(
    priceId: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const coingeckoId = priceIdToCoingeckoId(priceId, tokenList)

    const supplies = await this.client.getCirculatingSupplies(
      CoingeckoId(coingeckoId),

      { from: timestamp, to: timestamp },
    )
    assert(
      supplies.length === 1,
      `${priceId}: Too many supplies fetched ${JSON.stringify(supplies)}`,
    )

    return supplies[0].value
  }
}
