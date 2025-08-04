import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TokenValue } from '../types'
import type { DataStorage } from './DataStorage'

export class DBStorage implements DataStorage {
  private prices: Map<UnixTime, Map<string, number>> = new Map()
  private amounts: Map<UnixTime, Map<string, bigint>> = new Map()

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
    private readonly preloadOnly: boolean = false,
  ) {}

  async preloadPrices(configurationIds: string[], timestamps: UnixTime[]) {
    if (configurationIds.length === 0 || timestamps.length === 0) {
      return
    }

    this.prices = new Map(timestamps.map((t) => [t, new Map()]))

    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]
    const records = await this.db.tvsPrice.getPricesInRange(
      configurationIds,
      from,
      to,
    )

    for (const r of records) {
      this.prices.get(r.timestamp)?.set(r.configurationId, r.priceUsd)
    }
  }

  async preloadAmounts(configurationIds: string[], timestamps: UnixTime[]) {
    if (configurationIds.length === 0 || timestamps.length === 0) {
      return
    }

    this.amounts = new Map(timestamps.map((t) => [t, new Map()]))
    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]

    const batchSize = 1000
    for (let i = 0; i < configurationIds.length; i += batchSize) {
      const batch = configurationIds.slice(i, i + batchSize)

      const records = await this.db.tvsAmount.getAmountsInRange(batch, from, to)
      for (const r of records) {
        this.amounts.get(r.timestamp)?.set(r.configurationId, r.amount)
      }
    }
  }

  async getPrice(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const price = this.prices.get(timestamp)?.get(configurationId)

    if (price !== undefined || this.preloadOnly) {
      return Promise.resolve(price)
    }

    // if not preloaded, we need to fetch from DB
    const priceRecord = await this.db.tvsPrice.getPrice(
      configurationId,
      timestamp,
    )

    if (priceRecord) {
      return Promise.resolve(priceRecord.priceUsd)
    }

    // Fallback is needed due to the way PriceIndexer works.
    // If CoingeckoClient returns empty response we will not save anything to DB
    // and skip this timestamp altogether, effectively creating a gap in data.
    const fallback = await this.db.tvsPrice.getLatestPriceBefore(
      configurationId,
      timestamp,
    )

    if (fallback) {
      this.logger.warn('Price fallback triggered', {
        configurationId,
        timestamp,
        fallbackTimestamp: fallback.timestamp,
        fallbackPrice: fallback.priceUsd,
      })
    }

    return fallback?.priceUsd
  }

  async getAmount(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<bigint | undefined> {
    const amount = this.amounts.get(timestamp)?.get(configurationId)

    if (amount !== undefined || this.preloadOnly) {
      return Promise.resolve(amount)
    }

    // if not preloaded, we need to fetch from DB
    const amountRecord = await this.db.tvsAmount.getAmount(
      configurationId,
      timestamp,
    )

    if (amountRecord) {
      return Promise.resolve(amountRecord.amount)
    }

    // Fallback is needed for circulating supplies.
    // For the same reasons as in prices, CoingeckoClient can return empty response.
    const fallback = await this.db.tvsAmount.getLatestAmountBefore(
      configurationId,
      timestamp,
    )

    if (fallback) {
      this.logger.warn('Amount fallback triggered', {
        configurationId,
        timestamp,
        fallbackTimestamp: fallback.timestamp,
        fallbackAmount: fallback.amount,
      })
    }

    return fallback?.amount
  }

  async getTimestamp(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    return await this.db.tvsBlockTimestamp.findBlockNumberByChainAndTimestamp(
      chain,
      timestamp,
    )
  }

  async getLastNonZeroValues(
    timestamp: number,
    project: string | undefined,
  ): Promise<TokenValue[]> {
    return await this.db.tvsTokenValue.getLastNonZeroValue(timestamp, project)
  }
}
