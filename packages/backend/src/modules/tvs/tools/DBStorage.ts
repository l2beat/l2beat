import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'

export class DBStorage implements DataStorage {
  private prices: Map<UnixTime, Map<string, number>> = new Map()
  private amounts: Map<UnixTime, Map<string, bigint>> = new Map()

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {}

  async preloadPrices(configurationIds: string[], timestamps: UnixTime[]) {
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
    this.amounts = new Map(timestamps.map((t) => [t, new Map()]))

    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]
    const records = await this.db.tvsAmount.getAmountsInRange(
      configurationIds,
      from,
      to,
    )

    for (const r of records) {
      this.amounts.get(r.timestamp)?.set(r.configurationId, r.amount)
    }
  }

  async getPrice(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const price = this.prices.get(timestamp)?.get(configurationId)

    if (price) {
      return Promise.resolve(price)
    }

    // Fallback is needed due to the way PriceIndexer works.
    // If CoingeckoClient returns empty response we will not save anything to DB
    // and skip this timestamp altogether, effectively creating a gap in data.
    const fallback = await this.db.tvsPrice.getLatestPriceBefore(
      configurationId,
      timestamp,
    )
    assert(
      fallback,
      `Price fallback failed for ${configurationId} for ${timestamp}`,
    )

    this.logger.warn(`Price fallback triggered`, {
      configurationId,
      timestamp,
      fallbackTimestamp: fallback.timestamp,
      fallbackPrice: fallback.priceUsd,
    })
    return fallback.priceUsd
  }

  async getAmount(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<bigint | undefined> {
    const amount = await Promise.resolve(
      this.amounts.get(timestamp)?.get(configurationId),
    )

    if (amount) {
      return Promise.resolve(amount)
    }

    // Fallback is needed for circulating supplies.
    // For the same reasons as in prices, CoingeckoClient can return empty response.
    const fallback = await this.db.tvsAmount.getLatestAmountBefore(
      configurationId,
      timestamp,
    )
    assert(
      fallback,
      `Amount fallback failed for ${configurationId} for ${timestamp}`,
    )

    this.logger.warn(`Amount fallback triggered`, {
      configurationId,
      timestamp,
      fallbackTimestamp: fallback.timestamp,
      fallbackAmount: fallback.amount,
    })
    return fallback.amount
  }
}
