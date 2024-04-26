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
  extends Omit<ManagedMultiIndexerOptions<CoingeckoPriceConfigEntry>, 'name'> {
  coingeckoQueryService: CoingeckoQueryService
  priceRepository: PriceRepository
  syncOptimizer: SyncOptimizer
  coingeckoId: CoingeckoId
}

export class PriceIndexer extends ManagedMultiIndexer<CoingeckoPriceConfigEntry> {
  constructor(private readonly $: PriceIndexerDeps) {
    const logger = $.logger.tag($.coingeckoId.toString())
    const name = 'price_indexer'
    super({ ...$, name, logger })
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

    // There are multiple price configs with possibly different until timestamps.
    // We need to find the latest until timestamp to return.
    const maxTo = prices
      .map((p) => p.timestamp.toNumber())
      .reduce((a, b) => Math.max(a, b), 0)

    this.logger.info('Fetched & optimized prices in range', {
      from,
      to: maxTo,
      prices: prices.length,
      configurations: configurationsWithMissingData.length,
    })

    await this.$.priceRepository.addMany(prices)

    this.logger.info('Saved prices into DB', {
      prices: prices.length,
    })

    return maxTo > to ? to : maxTo
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

    const optimizedPrices = prices.filter((p) =>
      this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
    )

    return configurations
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
