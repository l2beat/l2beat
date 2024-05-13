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

export interface L2CostsPricesDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  l2CostsPricesRepository: L2CostsPricesRepository
  coingeckoQueryService: CoingeckoQueryService
}

const COINGECKO_ID = CoingeckoId('ethereum')

export class L2CostsPricesIndexer extends ManagedChildIndexer {
  constructor(private readonly $: L2CostsPricesDeps) {
    super({ ...$, name: 'l2_costs_prices' })
  }

  override async update(from: number, to: number): Promise<number> {
    const [shiftedFrom, shiftedTo] = this.shift(from, to)

    this.logger.info('Time range shifted', {
      shiftedFrom,
      shiftedTo,
    })

    if (shiftedFrom.equals(shiftedTo)) {
      this.logger.info('Nothing to sync')
      return to
    }

    const prices = await this.fetchPrices(shiftedFrom, shiftedTo)

    if (prices.length === 0) {
      this.logger.info('Nothing to save in DB')
      return to
    }

    await this.$.l2CostsPricesRepository.addMany(prices)

    this.logger.info('Saved prices into DB', {
      prices: prices.length,
    })

    return shiftedTo.add(1, 'seconds').toNumber()
  }

  shift(from: number, to: number): [UnixTime, UnixTime] {
    const shiftedFrom = new UnixTime(from).toStartOf('hour')

    const unixTo = new UnixTime(to)
    const maxRange = shiftedFrom.add(
      CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL,
      'days',
    )

    let shiftedTo = unixTo.gt(maxRange) ? maxRange : unixTo

    // do not include ending hour
    // 13:00:00 => 12:59:59
    shiftedTo = shiftedTo.toStartOf('hour').add(-1, 'seconds')

    return [shiftedFrom, shiftedTo]
  }

  async fetchPrices(
    from: UnixTime,
    to: UnixTime,
  ): Promise<L2CostsPricesRecord[]> {
    const prices = await this.$.coingeckoQueryService.getUsdPriceHistoryHourly(
      COINGECKO_ID,
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
