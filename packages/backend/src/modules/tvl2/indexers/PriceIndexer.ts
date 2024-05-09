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
import { PriceRepository } from '../repositories/PriceRepository'
import { PriceService } from '../services/PriceService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface PriceIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<CoingeckoPriceConfigEntry>, 'name'> {
  priceService: PriceService
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
    const optimizedFrom = this.$.syncOptimizer.getTimestampToSync(from, to)

    const configurationsWithMissingData = configurations.filter(
      (c) => !c.hasData,
    )

    if (configurationsWithMissingData.length !== configurations.length) {
      this.logger.info('Skipping update for configurations with data', {
        configurations: configurations.length,
        configurationsWithMissingData: configurationsWithMissingData.length,
      })
    }

    if (configurationsWithMissingData.length === 0) {
      this.logger.info('No configurations with missing data')
      return to
    }

    const prices = await this.$.priceService.fetchAndOptimizePrices(
      configurationsWithMissingData,
      optimizedFrom,
      new UnixTime(to),
    )

    this.logger.info('Fetched & optimized prices in range', {
      from: optimizedFrom.toNumber(),
      to: prices.fetchedUntil.toNumber(),
      prices: prices.prices.length,
      configurations: configurationsWithMissingData.length,
    })

    if (prices.prices.length === 0) {
      return to
    }

    await this.$.priceRepository.addMany(prices.prices)

    this.logger.info('Saved prices into DB', {
      from: optimizedFrom.toNumber(),
      to: prices.fetchedUntil.toNumber(),
      prices: prices.prices.length,
      configurations: configurationsWithMissingData.length,
    })

    return prices.fetchedUntil.toNumber() < to
      ? prices.fetchedUntil.toNumber()
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
