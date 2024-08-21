import {
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import {
  Configuration,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import { PriceIndexerDeps } from './types'

const NAME = 'price_indexer'
export class PriceIndexer extends ManagedMultiIndexer<CoingeckoPriceConfigEntry> {
  constructor(private readonly $: PriceIndexerDeps) {
    super({
      ...$,
      name: NAME,
      tag: $.coingeckoId.toString(),
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
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

    return async () => {
      await this.$.db.price.insertMany(optimizedPrices)
      this.logger.info('Saved prices into DB', {
        from,
        to: adjustedTo.toNumber(),
        configurationsToSync: configurations.length,
        prices: optimizedPrices.length,
      })

      return adjustedTo.toNumber()
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords = await this.$.db.price.deleteByConfigInTimeRange(
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

  static getId(coingeckoId: CoingeckoId) {
    return Indexer.createId(NAME, coingeckoId.toString())
  }
}
