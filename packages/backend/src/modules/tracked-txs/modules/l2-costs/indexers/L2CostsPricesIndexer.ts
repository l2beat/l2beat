import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'

import { CoingeckoQueryService } from '@l2beat/shared'
import {
  L2CostsPricesRecord,
  L2CostsPricesRepository,
} from '../repositories/L2CostsPricesRepository'

export interface L2CostsPricesIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  l2CostsPricesRepository: L2CostsPricesRepository
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

    const maxRange = unixFrom.add(
      CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL,
      'days',
    )

    const shiftedTo = unixTo.gt(maxRange) ? maxRange : unixTo

    this.logger.info('Time range shifted', {
      shiftedTo,
    })

    const prices = await this.fetchPrices(unixFrom, shiftedTo)

    if (prices.length === 0) {
      this.logger.info('Nothing to save in DB')
      return to
    }

    await this.$.l2CostsPricesRepository.addMany(prices)

    this.logger.info('Saved prices into DB', {
      prices: prices.length,
    })

    return shiftedTo.toNumber()
  }

  async fetchPrices(
    from: UnixTime,
    to: UnixTime,
  ): Promise<L2CostsPricesRecord[]> {
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
    await this.$.l2CostsPricesRepository.deleteAfter(unixTargetHeight)

    return targetHeight
  }
}
