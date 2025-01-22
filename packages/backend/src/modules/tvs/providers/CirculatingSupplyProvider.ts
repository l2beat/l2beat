import { tokenList } from '@l2beat/config'
import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import { tickerToCoingeckoId } from './tickerToCoingeckoId'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupply(
    ticker: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const coingeckoId = tickerToCoingeckoId(ticker, tokenList)

    const supplies = await this.client.getCirculatingSupplies(
      CoingeckoId(coingeckoId),

      { from: timestamp, to: timestamp },
    )
    assert(
      supplies.length === 1,
      `${ticker}: Too many supplies fetched ${JSON.stringify(supplies)}`,
    )

    return supplies[0].value
  }
}
