import type { Logger } from '@l2beat/backend-tools'
import type { PrivacyPriceRecord } from '@l2beat/database'
import type { PriceProvider } from '@l2beat/shared'
import {
  CoingeckoId,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createPrivacyConfigurationId } from '../../../config/features/privacy'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
} from '../../../tools/uif/multi/types'
import type { PrivacyPriceIndexerConfig } from '../types'

export interface PrivacyPriceIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<PrivacyPriceIndexerConfig>, 'name'> {
  priceProvider: PriceProvider
}

export class PrivacyPriceIndexer extends ManagedMultiIndexer<PrivacyPriceIndexerConfig> {
  constructor(
    private readonly $: PrivacyPriceIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_PRICE,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<PrivacyPriceIndexerConfig>[],
  ) {
    const adjustedTo = this.$.priceProvider.getAdjustedTo(from, to)

    this.logger.info('Fetching privacy prices', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const configsByPriceId = new Map<
      string,
      Configuration<PrivacyPriceIndexerConfig>[]
    >()
    for (const configuration of configurations) {
      const priceId = configuration.properties.priceId
      const existing = configsByPriceId.get(priceId) ?? []
      existing.push(configuration)
      configsByPriceId.set(priceId, existing)
    }

    const records = (
      await Promise.all(
        Array.from(configsByPriceId.entries()).map(
          async ([priceId, configs]) => {
            try {
              const prices =
                await this.$.priceProvider.getUsdPriceHistoryHourly(
                  CoingeckoId(priceId),
                  from,
                  adjustedTo,
                )

              const configurationRecords: PrivacyPriceRecord[] =
                configs.flatMap((configuration) =>
                  prices.map((p) => ({
                    configurationId: configuration.id,
                    timestamp: p.timestamp,
                    priceUsd: p.value,
                    priceId,
                  })),
                )

              return configurationRecords
            } catch (error) {
              if (
                error instanceof Error &&
                error.message.startsWith('Insufficient data in response')
              ) {
                this.logger.warn(`Failed to fetch prices for ${priceId}`, {
                  priceId,
                  error,
                })
                return []
              }

              throw error
            }
          },
        ),
      )
    ).flat()

    this.logger.info('Fetched privacy prices', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
      records: records.length,
    })

    return async () => {
      await this.$.db.privacyPrice.upsertMany(records)

      this.logger.info('Saved privacy prices into DB', {
        from,
        to: adjustedTo,
        records: records.length,
      })

      return adjustedTo
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    if (configurations.length === 0) return

    const configs = configurations.map((c) => ({
      configurationId: c.id,
      fromInclusive: UnixTime(c.from),
      toInclusive: UnixTime(c.to),
    }))

    const deletedRecords = await this.$.db.privacyPrice.deleteByConfigs(configs)

    if (deletedRecords > 0) {
      this.logger.info('Deleted privacy price records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  static idToConfigurationId(config: PrivacyPriceIndexerConfig): string {
    return createPrivacyConfigurationId(['privacy-price', config.priceId])
  }
}
