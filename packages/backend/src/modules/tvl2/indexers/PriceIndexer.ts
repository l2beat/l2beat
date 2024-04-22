import { assert } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from '../../../tools/uif/multi/ManagedMultiIndexer'
import {
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../../tools/uif/multi/types'
import { PriceRecord, PriceRepository } from '../repositories/PriceRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface PriceIndexerDeps
  extends ManagedMultiIndexerOptions<CoingeckoPriceConfigEntry> {
  coingeckoQueryService: CoingeckoQueryService
  priceRepository: PriceRepository
  syncOptimizer: SyncOptimizer
  coingeckoId: CoingeckoId
}

export class PriceIndexer extends ManagedMultiIndexer<CoingeckoPriceConfigEntry> {
  indexerId: string

  constructor(private readonly $: PriceIndexerDeps) {
    super($)
    this.indexerId = $.id
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[],
  ): Promise<number> {
    const configurationsWithMissingData = configurations.filter(
      (c) => !c.hasData,
    )
    if (configurationsWithMissingData.length === 0) {
      return to
    }

    const prices = await this.fetchAndOptimizePrices(
      from,
      to,
      configurationsWithMissingData,
    )
    if (prices.length === 0) {
      return to
    }

    await this.$.priceRepository.addMany(prices)

    const maxTo = prices
      .map((p) => p.timestamp.toNumber())
      .reduce((a, b) => Math.max(a, b), 0)

    return maxTo < to ? to : maxTo
  }

  private async fetchAndOptimizePrices(
    from: number,
    to: number,
    configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[],
  ): Promise<PriceRecord[]> {
    const adjustedFrom = this.$.syncOptimizer.getTimestampToSync(
      new UnixTime(from),
    )

    if (adjustedFrom.gt(new UnixTime(to))) {
      return []
    }

    const adjustedTo = this.getAdjustedTo(adjustedFrom, to)

    const prices = await this.$.coingeckoQueryService.getUsdPriceHistoryHourly(
      this.$.coingeckoId,
      adjustedFrom,
      adjustedTo,
      undefined,
    )

    return configurations
      .map((c) =>
        prices
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
  }

  private getAdjustedTo(from: UnixTime, to: number): UnixTime {
    const alignedTo = new UnixTime(to).toStartOf('hour')
    assert(from.lte(alignedTo), 'Programmer error: from > to')

    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL

    return alignedTo.gt(from.add(maxDaysForOneCall, 'days'))
      ? from.add(maxDaysForOneCall, 'days')
      : alignedTo
  }

  override async removeData(
    configurations: RemovalConfiguration<CoingeckoPriceConfigEntry>[],
  ): Promise<void> {
    for (const configuration of configurations) {
      await this.$.priceRepository.deleteByConfigInTimeRange(
        configuration.id,
        new UnixTime(configuration.from),
        new UnixTime(configuration.to),
      )
    }
  }
}
