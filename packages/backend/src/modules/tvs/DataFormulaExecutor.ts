import type { UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'
import type { AmountConfig, PriceConfig } from './types'

export class DataFormulaExecutor {
  constructor(private storage: DataStorage) {}

  /** Fetches data from APIs. Writes result to LocalStorage */
  async execute(
    prices: PriceConfig[],
    amounts: AmountConfig[],
    timestamps: UnixTime[],
  ) {
    for (const timestamp of timestamps) {
      for (const amount of amounts) {
        const v = await this.fetchAmount(amount, timestamp)
        await this.storage.writeAmount(amount.id, timestamp, v)
      }

      for (const price of prices) {
        // TODO: PriceProvider which operates on tickers
        const v = await this.fetchPrice(price, timestamp)
        await this.storage.writePrice(price.id, timestamp, v)
      }
    }
  }

  fetchAmount(_config: AmountConfig, _timestamp: UnixTime): Promise<bigint> {
    throw new Error('Not implemented')
  }
  fetchPrice(_config: PriceConfig, _timestamp: UnixTime): Promise<number> {
    throw new Error('Not implemented')
  }
}
