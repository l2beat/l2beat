import type { InteropRecentPricesRecord } from '@l2beat/database/dist/repositories/InteropRecentPricesRepository'
import type { PriceProvider } from '@l2beat/shared'
import {
  type Configuration,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../tools/uif/multi/types'

export interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<{ version: number }>, 'name'> {
  priceProvider: PriceProvider
}

export class TvsPriceIndexer extends ManagedMultiIndexer<{ version: number }> {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: INDEXER_NAMES.INTEROP_RECENT_PRICES,
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    _: Configuration<{ version: number }>[],
  ) {
    const target = UnixTime.toStartOf(to, 'hour')
    if (target > to) {
      return () => {
        this.logger.info('Update skipped, no full hour in range', {
          from,
          to,
          target,
        })

        return Promise.resolve(to)
      }
    }

    const coingeckoIds = await this.$.priceProvider.getAllCoingeckoIds()

    const prices = await this.$.priceProvider.getLatestPrices(coingeckoIds)

    const records: InteropRecentPricesRecord[] = []
    for (const [coingeckoId, priceUsd] of prices.entries()) {
      records.push({ coingeckoId, priceUsd, timestamp: target })
    }

    return async () => {
      await this.$.db.interopRecentPrices.insertMany(records)

      this.logger.info('Saved prices into DB', {
        from,
        to,
        target,
        records: records.length,
      })

      return target
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.interopRecentPrices.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(configuration.from),
          UnixTime(configuration.to),
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted records for configuration', {
          from: configuration.from,
          to: configuration.to,
          id: configuration.id,
          deletedRecords,
        })
      }
    }
  }
}
