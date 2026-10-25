import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { CoinMarketData } from '../chains/clients/coingecko/types'
import type { MarketData, PriceSource } from './estimateValues'

// Keeps the coins/markets query string under the prices proxy limit.
const MARKETS_CHUNK = 100

export class MarketDataSource implements PriceSource {
  constructor(
    private readonly db: Database,
    private readonly getCoinsMarketData: (
      ids: string[],
    ) => Promise<CoinMarketData[]>,
    private readonly logger: Logger,
  ) {}

  async getMarketData(
    coingeckoIds: string[],
  ): Promise<Map<string, MarketData>> {
    const now = UnixTime.now()
    const [recentPrices, markets] = await Promise.all([
      this.db.interopRecentPrices.getClosestPricesAtOrBefore(
        coingeckoIds.map((coingeckoId, requestId) => ({
          requestId,
          coingeckoId,
          timestamp: now,
        })),
        UnixTime.DAY,
      ),
      this.getMarkets(coingeckoIds),
    ])

    return new Map(
      coingeckoIds.map((id, index) => {
        const market = markets.get(id)
        return [
          id,
          {
            priceUsd:
              recentPrices.get(index) ?? market?.current_price ?? undefined,
            circulatingSupply: market?.circulating_supply ?? undefined,
          },
        ]
      }),
    )
  }

  private async getMarkets(
    coingeckoIds: string[],
  ): Promise<Map<string, CoinMarketData>> {
    const result = new Map<string, CoinMarketData>()
    for (let i = 0; i < coingeckoIds.length; i += MARKETS_CHUNK) {
      const chunk = coingeckoIds.slice(i, i + MARKETS_CHUNK)
      try {
        for (const market of await this.getCoinsMarketData(chunk)) {
          result.set(market.id, market)
        }
      } catch (error) {
        this.logger.warn('CoinGecko markets request failed', {
          ids: chunk.length,
          error,
        })
      }
    }
    return result
  }
}
