import type { Logger } from '@l2beat/backend-tools'
import type { TvsPriceRecord } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import type { PriceConfig } from '../types'

export interface TvsPriceIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<PriceConfig>, 'name'> {
  syncOptimizer: SyncOptimizer
  priceProvider: PriceProvider
}

// If more than this ratio of all configurations is failing we assume the
// problem is systemic (e.g. Coingecko outage) and rethrow to let the retry
// strategy handle it instead of quarantining the configurations.
const MAX_QUARANTINED_RATIO = 0.2

export class TvsPriceIndexer extends ManagedMultiIndexer<PriceConfig> {
  constructor(
    private readonly $: TvsPriceIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.TVS_PRICE,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
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

    const activeConfigurations = configurations.filter(
      (c) => !this.isConfigurationQuarantined(c.id),
    )
    if (activeConfigurations.length < configurations.length) {
      this.logger.info('Skipping quarantined configurations', {
        skipped: configurations.length - activeConfigurations.length,
      })
    }

    this.logger.info('Fetching prices', {
      from,
      to: adjustedTo,
      configurations: activeConfigurations.length,
    })

    const failures: { configurationId: string; error: unknown }[] = []

    const records = (
      await Promise.all(
        activeConfigurations.map(async (configuration) => {
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

            this.logger.error(
              `Error fetching prices for ${configuration.properties.priceId}`,
              {
                priceId: configuration.properties.priceId,
                error,
              },
            )

            failures.push({ configurationId: configuration.id, error })
            return []
          }
        }),
      )
    ).flat()

    if (failures.length > 0) {
      const maxQuarantined = Math.floor(
        this.options.configurations.length * MAX_QUARANTINED_RATIO,
      )
      if (
        this.quarantinedConfigurationsCount() + failures.length >
        maxQuarantined
      ) {
        throw failures[0]?.error
      }
      for (const failure of failures) {
        this.quarantineConfiguration(failure.configurationId)
      }
    }

    this.logger.info('Fetched prices', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
      records: records.length,
    })

    return async () => {
      await this.$.db.tvsPrice.upsertMany(records)

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

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    const deletedRecords = await this.$.db.tvsPrice.deleteByConfigIds(
      configurations.map((c) => c.id),
    )
    if (deletedRecords > 0) {
      this.logger.info('Wiped records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    const configs = configurations.map((c) => ({
      configurationId: c.id,
      fromInclusive: c.range[0],
      toInclusive: c.range[1],
    }))
    const deletedRecords = await this.$.db.tvsPrice.deleteByConfigs(configs)
    if (deletedRecords > 0) {
      this.logger.info('Trimmed records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }
}
