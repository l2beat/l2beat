import type { Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'

export class DBStorage implements DataStorage {
  prices: Map<UnixTime, Map<string, number>> = new Map()
  amounts: Map<UnixTime, Map<string, bigint>> = new Map()

  constructor(private readonly db: Database) {}

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

  getPrice(id: string, timestamp: UnixTime): Promise<number | undefined> {
    return Promise.resolve(this.prices.get(timestamp)?.get(id))
  }

  getAmount(id: string, timestamp: UnixTime): Promise<bigint | undefined> {
    return Promise.resolve(this.amounts.get(timestamp)?.get(id))
  }
}
