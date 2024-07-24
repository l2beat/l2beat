import { Database, L2CostPriceRecord } from '@l2beat/database'
import { CoingeckoQueryService } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'

export interface L2CostsPricesIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  coingeckoQueryService: CoingeckoQueryService
}

export const ETHEREUM_COINGECKO_ID = CoingeckoId('ethereum')

export class L2CostsPricesIndexer extends ManagedChildIndexer {
  constructor(private readonly $: L2CostsPricesIndexerDeps) {
    super({ ...$, name: 'l2_costs_prices' })
  }

  override async update(from: number, to: number): Promise<number> {
    const unixFrom = new UnixTime(from)
    const unixTo = new UnixTime(to)

    const shiftedTo = CoingeckoQueryService.getAdjustedTo(unixFrom, unixTo)

    this.logger.info('Time range shifted', {
      shiftedTo,
    })

    const prices = await this.fetchPrices(unixFrom, shiftedTo)

    if (prices.length === 0) {
      this.logger.info('Nothing to save in DB')
      return to
    }

    await this.$.db.l2CostPrice.addMany(prices)

    this.logger.info('Saved prices into DB', {
      prices: prices.length,
    })

    return shiftedTo.toNumber()
  }

  async fetchPrices(
    from: UnixTime,
    to: UnixTime,
  ): Promise<L2CostPriceRecord[]> {
    const prices = await this.$.coingeckoQueryService.getUsdPriceHistoryHourly(
      ETHEREUM_COINGECKO_ID,
      from,
      to,
      undefined,
    )

    return prices.map((p) => ({
      timestamp: p.timestamp,
      priceUsd: p.value,
    }))
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const unixTargetHeight = new UnixTime(targetHeight)
    await this.$.db.l2CostPrice.deleteAfter(unixTargetHeight)

    return targetHeight
  }
}
