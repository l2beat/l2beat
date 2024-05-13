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
    const configurationsToSync = configurations.filter((c) => !c.hasData)

    if (configurationsToSync.length !== configurations.length) {
      this.logger.info('Filtered out configurations with data', {
        skippedConfigurations:
          configurations.length - configurationsToSync.length,
        configurationsToSync: configurationsToSync.length,
        from,
        to,
      })
    }

    if (configurationsToSync.length === 0) {
      this.logger.info('No configurations to sync', {
        from,
        to,
      })
      return to
    }

    const adjustedTo = this.$.priceService.getAdjustedTo(from, to)

    const prices = await this.$.priceService.fetchPrices(
      new UnixTime(from),
      adjustedTo,
      this.$.coingeckoId,
      configurationsToSync,
    )

    this.logger.info('Fetched prices in range', {
      from,
      to: adjustedTo.toNumber(),
      configurationsToSync: configurationsToSync.length,
      prices: prices.length,
    })

    const optimizedPrices = prices.filter((p) =>
      this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
    )

    await this.$.priceRepository.addMany(optimizedPrices)

    this.logger.info('Saved prices into DB', {
      from,
      to: adjustedTo.toNumber(),
      configurationsToSync: configurationsToSync.length,
      prices: optimizedPrices.length,
    })

    return adjustedTo.toNumber()
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
