import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DatabaseMiddleware,
  DatabaseTransaction,
} from '../../../peripherals/database/DatabaseMiddleware'
import { DEFAULT_RETRY_FOR_TVL } from '../../../tools/uif/defaultRetryForTvl'
import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from '../../../tools/uif/multi/ManagedMultiIndexer'
import {
  Configuration,
  RemovalConfiguration,
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
    super({ ...$, name, logger, updateRetryStrategy: DEFAULT_RETRY_FOR_TVL })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
    dbMiddleware: DatabaseMiddleware,
  ) {
    const adjustedTo = this.$.priceService.getAdjustedTo(from, to)

    const prices = await this.$.priceService.fetchPrices(
      new UnixTime(from),
      adjustedTo,
      this.$.coingeckoId,
      configurations,
    )

    this.logger.info('Fetched prices in range', {
      from,
      to: adjustedTo.toNumber(),
      configurationsToSync: configurations.length,
      prices: prices.length,
    })

    const optimizedPrices = prices.filter((p) =>
      this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
    )

    dbMiddleware.add(async (trx?: DatabaseTransaction) => {
      this.logger.info('Saving prices into DB', {
        from,
        to: adjustedTo.toNumber(),
        configurationsToSync: configurations.length,
        prices: optimizedPrices.length,
      })

      await this.$.priceRepository.addMany(optimizedPrices, trx)
    })

    return adjustedTo.toNumber()
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.priceRepository.deleteByConfigInTimeRange(
          configuration.id,
          new UnixTime(configuration.from),
          new UnixTime(configuration.to),
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted records', {
          from: configuration.from,
          to: configuration.to,
          id: configuration.id,
          deletedRecords,
        })
      }
    }
  }
}
