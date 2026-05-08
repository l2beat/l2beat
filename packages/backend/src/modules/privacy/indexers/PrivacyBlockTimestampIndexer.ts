import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import {
  assert,
  type Configuration,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createPrivacyConfigurationId } from '../../../config/features/privacy'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../../tools/uif/multi/types'
import type { PrivacyBlockTimestampConfig } from '../types'

interface PrivacyBlockTimestampIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<PrivacyBlockTimestampConfig>,
    'name' | 'logger'
  > {
  blockTimestampProvider: BlockTimestampProvider
  db: Database
}

export class PrivacyBlockTimestampIndexer extends ManagedMultiIndexer<PrivacyBlockTimestampConfig> {
  // used only for runtime invalidation protection
  blockHeight = 0

  constructor(
    private readonly $: PrivacyBlockTimestampIndexerDeps,
    logger: Logger,
  ) {
    assert(
      $.configurations.length === 1,
      'This indexer should take only one configuration',
    )
    super(
      {
        ...$,
        name: INDEXER_NAMES.PRIVACY_BLOCK_TIMESTAMP,
        tags: {
          tag: $.configurations[0].properties.chain,
          chain: $.configurations[0].properties.chain,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<PrivacyBlockTimestampConfig>[],
  ) {
    const timestamp = this.getTimestampToSync(from)
    if (timestamp > to) {
      this.logger.info('Timestamp out of range', {
        from,
        to,
        timestamp,
      })
      return () => Promise.resolve(to)
    }

    this.logger.info('Fetching block number for timestamp', {
      timestamp,
    })

    const blockNumber =
      await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
        timestamp,
        configurations[0].properties.chain,
      )

    this.logger.info('Fetched block number for timestamp', {
      timestamp,
      blockNumber,
    })

    assert(blockNumber >= this.blockHeight, 'Block number cannot be smaller', {
      blockNumber,
      blockHeight: this.blockHeight,
    })

    this.blockHeight = blockNumber

    return async () => {
      await this.$.db.privacyBlockTimestamp.upsertMany([
        {
          configurationId: configurations[0].id,
          chain: configurations[0].properties.chain,
          timestamp,
          blockNumber,
        },
      ])
      this.logger.info('Saved block number into DB', {
        timestamp,
        blockNumber,
      })
      return timestamp
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.privacyBlockTimestamp.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(configuration.from),
          UnixTime(configuration.to),
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted block timestamp records', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }

  static idToConfigurationId(
    config: PrivacyBlockTimestampConfig,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-block-timestamp',
      config.chain,
    ])
  }

  private getTimestampToSync(from: number): number {
    return UnixTime.toStartOf(from, 'hour')
  }
}
