import { assert, Logger } from '@l2beat/backend-tools'

import { CoingeckoQueryService } from '@l2beat/shared'
import { CoingeckoPriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { UpdateConfiguration } from '../../../tools/uif/multi/types'
import { PriceRecord } from '../repositories/PriceRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface PriceServiceDependencies {
  readonly coingeckoQueryService: CoingeckoQueryService
  readonly syncOptimizer: SyncOptimizer
  logger: Logger
}

export class PriceService {
  constructor(private readonly $: PriceServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  async fetchAndOptimizePrices(
    configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<{
    fetchedUntil: UnixTime
    prices: PriceRecord[]
  }> {
    const adjustedTo = this.getAdjustedTo(from, to)

    const coingeckoId = configurations[0].properties.coingeckoId
    assert(
      configurations.every((c) => c.properties.coingeckoId === coingeckoId),
      'Configuration error: coingeckoId mismatch',
    )

    const prices = await this.$.coingeckoQueryService.getUsdPriceHistoryHourly(
      coingeckoId,
      from,
      adjustedTo,
      undefined,
    )

    const optimizedPrices = prices.filter((p) =>
      this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
    )

    const pricesWithConfigurations = configurations
      .map((c) =>
        optimizedPrices
          .filter((p) =>
            p.timestamp.gte(new UnixTime(c.minHeight)) && c.maxHeight
              ? p.timestamp.lte(new UnixTime(c.maxHeight))
              : true,
          )
          .map((p) => ({
            timestamp: p.timestamp,
            priceUsd: p.value,
            configId: c.id,
          })),
      )
      .flat()

    const fetchedUntil =
      pricesWithConfigurations.length === 0
        ? to
        : pricesWithConfigurations
            .map((p) => p.timestamp)
            .reduce((a, b) => UnixTime.max(a, b), new UnixTime(0))

    return { fetchedUntil, prices: pricesWithConfigurations }
  }

  private getAdjustedTo(from: UnixTime, to: UnixTime): UnixTime {
    const alignedTo = to.toStartOf('hour')
    assert(from.lte(alignedTo), 'Programmer error: from > to')

    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL

    return alignedTo.gt(from.add(maxDaysForOneCall, 'days'))
      ? from.add(maxDaysForOneCall, 'days')
      : alignedTo
  }
}
