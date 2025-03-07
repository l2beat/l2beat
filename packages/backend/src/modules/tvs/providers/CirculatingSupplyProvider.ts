import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupply(
    priceId: string,
    decimals: number,
    timestamp: UnixTime,
  ): Promise<bigint> {
    const supplies = await this.client.getCirculatingSupplies(
      CoingeckoId(priceId),

      { from: timestamp, to: timestamp },
    )
    assert(
      supplies.length === 1,
      `${priceId}: Too many supplies fetched ${JSON.stringify(supplies)}`,
    )

    return BigInt(Math.round(supplies[0].value * 10 ** decimals))
  }

  async getLatestCirculatingSupplies(
    tokens: { priceId: string; decimals: number }[],
  ): Promise<Map<string, bigint>> {
    const coingeckoIds = tokens.map((token) => CoingeckoId(token.priceId))

    const latestMarketData = await this.client.getLatestMarketData(coingeckoIds)

    const result = new Map<string, bigint>()

    for (const token of tokens) {
      const data = latestMarketData.get(CoingeckoId(token.priceId))
      assert(data !== undefined, `${token.priceId}: Price not found`)
      result.set(
        token.priceId,
        BigInt(Math.round(data.circulating * 10 ** token.decimals)),
      )
    }

    return result
  }
}
