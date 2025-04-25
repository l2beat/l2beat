import type { CirculatingSupplyAmountFormula } from '@l2beat/config'
import type { TvsAmountRecord } from '@l2beat/database/dist/tvs/amount/entity'
import type { CirculatingSupplyProvider } from '@l2beat/shared'
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

export interface CirculatingSupplyAmountIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<CirculatingSupplyAmountFormula>,
    'name'
  > {
  syncOptimizer: SyncOptimizer
  circulatingSupplyProvider: CirculatingSupplyProvider
}

export class CirculatingSupplyAmountIndexer extends ManagedMultiIndexer<CirculatingSupplyAmountFormula> {
  constructor(private readonly $: CirculatingSupplyAmountIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.TVS_CIRCULATING_SUPPLY,
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<CirculatingSupplyAmountFormula>[],
  ) {
    const adjustedTo = this.$.circulatingSupplyProvider.getAdjustedTo(from, to)

    if (this.isEmptyRange(from, adjustedTo)) {
      this.logger.info('No timestamps to sync in range', {
        from,
        to,
        adjustedTo,
      })
      return () => Promise.resolve(to)
    }

    this.logger.info('Fetching circulating supplies', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const records = (
      await Promise.all(
        configurations.map(async (configuration) => {
          try {
            const supplies =
              await this.$.circulatingSupplyProvider.getCirculatingSupplies(
                CoingeckoId(configuration.properties.apiId),
                { from: from, to: adjustedTo },
              )
            const supplyRecords: TvsAmountRecord[] = supplies.map((p) => ({
              configurationId: configuration.id,
              timestamp: p.timestamp,
              amount: BigInt(p.value * 10 ** configuration.properties.decimals),
            }))

            const optimizedRecords = supplyRecords.filter((p) =>
              this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
            )

            return optimizedRecords
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.startsWith('Insufficient data in response')
            ) {
              this.logger.warn(
                `Failed to fetch for ${configuration.properties.apiId}`,
                {
                  priceId: configuration.properties.apiId,
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

    this.logger.info('Fetched circulating supplies', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
      records: records.length,
    })

    return async () => {
      await this.$.db.tvsAmount.insertMany(records)

      this.logger.info('Saved amounts into DB', {
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
      const deletedRecords =
        await this.$.db.tvsAmount.deleteByConfigInTimeRange(
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

  static SOURCE() {
    return 'l2b-circulating-supply'
  }
}
