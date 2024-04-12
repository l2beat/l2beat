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
    _from: number,
    _to: number,
    configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[],
  ): Promise<number> {
    const configurationsWithMissingData = configurations.filter(
      (c) => !c.hasData,
    )
    if (configurationsWithMissingData.length === 0) {
      return _to
    }

    const prices = await this.fetchAndOptimizePrices(
      _from,
      _to,
      configurationsWithMissingData,
    )
    if (prices.length === 0) {
      return _to
    }

    await this.$.priceRepository.addMany(prices)

    const maxTo = prices
      .map((p) => p.timestamp.toNumber())
      .reduce((a, b) => Math.max(a, b), 0)

    return maxTo < _to ? _to : maxTo
  }

  private async fetchAndOptimizePrices(
    _from: number,
    _to: number,
    configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[],
  ): Promise<PriceRecord[]> {
    const from = this.$.syncOptimizer.getTimestampToSync(new UnixTime(_from))

    if (from.gt(new UnixTime(_to))) {
      return []
    }

    const to = this.getAdjustedTo(from, _to)

    const prices = await this.$.coingeckoQueryService.getUsdPriceHistoryHourly(
      this.$.coingeckoId,
      from,
      to,
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

  private getAdjustedTo(from: UnixTime, _to: number): UnixTime {
    const to = new UnixTime(_to).toStartOf('hour')
    assert(from.lte(to), 'Programmer error: from > to')

    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL

    return to.gt(from.add(maxDaysForOneCall, 'days'))
      ? from.add(maxDaysForOneCall, 'days')
      : to
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
