import type { UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'
import type { CirculatingSupplyProvider } from './providers/CirculatingSupplyProvider'
import type { PriceProvider } from './providers/PriceProvider'
import type { AmountConfig, PriceConfig } from './types'

export class DataFormulaExecutor {
  constructor(
    private storage: DataStorage,
    private priceProvider: PriceProvider,
    private circulatingSupplyProvider: CirculatingSupplyProvider,
  ) {}

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
        const v = await this.fetchPrice(price, timestamp)
        await this.storage.writePrice(price.id, timestamp, v)
      }
    }
  }

  async fetchAmount(
    config: AmountConfig,
    timestamp: UnixTime,
  ): Promise<number> {
    switch (config.type) {
      case 'circulatingSupply':
        return await this.circulatingSupplyProvider.getCirculatingSupply(
          config.ticker,
          timestamp,
        )
    }

    throw new Error('Not implemented')
  }

  async fetchPrice(config: PriceConfig, timestamp: UnixTime): Promise<number> {
    return await this.priceProvider.getPrice(config.ticker, timestamp)
  }
}
