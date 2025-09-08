import type { TvsPriceRecord } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import {
  CoingeckoId,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import type { PriceConfig } from '../types'

export interface TvsPriceIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<PriceConfig>, 'name'> {
  syncOptimizer: SyncOptimizer
  priceProvider: PriceProvider
}

export class TvsPriceIndexer extends ManagedMultiIndexer<PriceConfig> {
  constructor(private readonly $: TvsPriceIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.TVS_PRICE,
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<PriceConfig>[],
  ) {
    const adjustedTo = this.$.priceProvider.getAdjustedTo(from, to)

    if (this.isEmptyRange(from, adjustedTo)) {
      this.logger.info('No timestamps to sync in range', {
        from,
        to,
        adjustedTo,
      })
      return () => Promise.resolve(to)
    }

    this.logger.info('Fetching prices', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const records = (
      await Promise.all(
        configurations.map(async (configuration) => {
          try {
            const prices = await this.$.priceProvider.getUsdPriceHistoryHourly(
              CoingeckoId(configuration.properties.priceId),
              UnixTime(from),
              adjustedTo,
            )
            const configurationRecords: TvsPriceRecord[] = prices.map((p) => ({
              configurationId: configuration.id,
              timestamp: p.timestamp,
              priceUsd: p.value,
              priceId: configuration.properties.priceId,
            }))

            const optimizedRecords = configurationRecords.filter((p) =>
              this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
            )

            return optimizedRecords
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.startsWith('Insufficient data in response')
            ) {
              this.logger.warn(
                `Failed to fetch prices for ${configuration.properties.priceId}`,
                {
                  priceId: configuration.properties.priceId,
                  error,
                },
              )
              return []
            }

            throw error
          }
        }),
      )
    ).flat()

    this.logger.info('Fetched prices', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
      records: records.length,
    })

    return async () => {
      await this.$.db.tvsPrice.insertMany(records)

      this.logger.info('Saved prices into DB', {
        from,
        to: adjustedTo,
        records: records.length,
      })

      return adjustedTo
    }
  }

  private isEmptyRange(from: number, adjustedTo: number) {
    return (
      this.$.syncOptimizer.getTimestampsToSync(from, adjustedTo, 1).length === 0
    )
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords = await this.$.db.tvsPrice.deleteByConfigInTimeRange(
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
