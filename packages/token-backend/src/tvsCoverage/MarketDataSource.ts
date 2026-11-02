import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { getErrorMessage, toBatches, UnixTime } from '@l2beat/shared-pure'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type { CoinMarketData } from '../chains/clients/coingecko/types'
import type { MarketData, PriceSource } from './estimateValues'

// Keeps the coins/markets query string under the prices proxy limit.
const MARKETS_BATCH_SIZE = 100

// Prices come from the interop price feed first, as in interop financials,
// and CoinGecko fills the rest. Circulating supply only comes from CoinGecko.
export class MarketDataSource implements PriceSource {
  constructor(
    private readonly db: Database,
    private readonly coingecko: Pick<CoingeckoClient, 'getCoinsMarketData'>,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async getMarketData(
    coingeckoIds: string[],
    warnings: string[],
  ): Promise<Map<string, MarketData>> {
    const [recentPrices, markets] = await Promise.all([
      this.getRecentPrices(coingeckoIds, warnings),
      this.getMarkets(coingeckoIds, warnings),
    ])
    return new Map(
      coingeckoIds.map((id) => {
        const market = markets.get(id)
        return [
          id,
          {
            priceUsd:
              recentPrices.get(id) ?? market?.current_price ?? undefined,
            // CoinGecko reports 0 when it does not know the circulating supply.
            circulatingSupply: market?.circulating_supply || undefined,
            circulatingSupplyUnknown: !market?.circulating_supply,
          },
        ]
      }),
    )
  }

  // Without the interop prices, CoinGecko prices every token.
  private async getRecentPrices(
    coingeckoIds: string[],
    warnings: string[],
  ): Promise<Map<string, number>> {
    const now = UnixTime.now()
    try {
      const prices =
        await this.db.interopRecentPrices.getClosestPricesAtOrBefore(
          coingeckoIds.map((coingeckoId, requestId) => ({
            requestId,
            coingeckoId,
            timestamp: now,
          })),
          UnixTime.DAY,
        )
      return new Map(
        coingeckoIds.flatMap((id, requestId) => {
          const price = prices.get(requestId)
          return price === undefined ? [] : [[id, price] as const]
        }),
      )
    } catch (error) {
      this.logger.warn('Interop recent prices query failed', { error })
      warnings.push(`Reading interop prices failed: ${getErrorMessage(error)}`)
      return new Map()
    }
  }

  // A failed request only leaves its own batch without CoinGecko data. It is
  // retried once, because a connection opened during the build's burst of RPC
  // reads can time out.
  private async getMarkets(
    coingeckoIds: string[],
    warnings: string[],
  ): Promise<Map<string, CoinMarketData>> {
    const batches = await Promise.all(
      toBatches(coingeckoIds, MARKETS_BATCH_SIZE).map(async (batch) => {
        try {
          return await this.coingecko
            .getCoinsMarketData(batch)
            .catch(() => this.coingecko.getCoinsMarketData(batch))
        } catch (error) {
          this.logger.warn('CoinGecko markets request failed', {
            ids: batch.length,
            error,
          })
          warnings.push(
            `Reading CoinGecko markets for ${batch.length} ids failed: ${getErrorMessage(error)}`,
          )
          return []
        }
      }),
    )
    return new Map(batches.flat().map((market) => [market.id, market]))
  }
}
