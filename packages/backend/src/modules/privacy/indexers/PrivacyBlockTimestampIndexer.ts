import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createPrivacyConfigurationId } from '../../../config/features/privacy'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
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

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    const deletedRecords =
      await this.$.db.privacyBlockTimestamp.deleteByConfigIds(
        configurations.map((c) => c.id),
      )

    if (deletedRecords > 0) {
      this.logger.info('Wiped block timestamp records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedRecords =
        await this.$.db.privacyBlockTimestamp.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed block timestamp records', {
          id: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  static idToConfigurationId(
    config: Omit<PrivacyBlockTimestampConfig, 'id'>,
  ): string {
    return createPrivacyConfigurationId([
      'privacy-block-timestamp',
      config.chain,
    ])
  }

  private getTimestampToSync(from: number): number {
    const hourStart = UnixTime.toStartOf(from, 'hour')
    // toStartOf rounds down, but UIF requires returned height >= from
    return hourStart < from ? hourStart + UnixTime.HOUR : hourStart
  }
}
