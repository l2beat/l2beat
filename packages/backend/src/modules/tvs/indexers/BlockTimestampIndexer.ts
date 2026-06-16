import type { Logger } from '@l2beat/backend-tools'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import type { BlockTimestampConfig } from '../types'

interface BlockTimestampIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<BlockTimestampConfig>,
    'name' | 'logger'
  > {
  syncOptimizer: SyncOptimizer
  blockTimestampProvider: BlockTimestampProvider
}

export class BlockTimestampIndexer extends ManagedMultiIndexer<BlockTimestampConfig> {
  // used only for runtime invalidation protection
  blockHeight = 0

  constructor(
    private readonly $: BlockTimestampIndexerDeps,
    logger: Logger,
  ) {
    assert(
      $.configurations.length === 1,
      'This indexer should take only one configuration',
    )
    super(
      {
        ...$,
        name: INDEXER_NAMES.TVS_BLOCK_TIMESTAMP,
        tags: {
          tag: $.configurations[0].properties.chainName,
          chain: $.configurations[0].properties.chainName,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<BlockTimestampConfig>[],
  ) {
    return await withCoreFeatureRpcMetricsContext(
      'tvs.blockTimestamp',
      { chain: configurations[0].properties.chainName },
      async () => {
        const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
        if (timestamp > to) {
          this.logger.info('Timestamp out of range', {
            from,
            to,
            timestamp,
          })
          return () => Promise.resolve(to)
        }

        this.logger.info('Fetching block number for timestamp', {
          timestamp: timestamp,
        })

        const blockNumber =
          await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
            timestamp,
            configurations[0].properties.chainName,
          )

        this.logger.info('Fetched block number for timestamp', {
          timestamp: timestamp,
          blockNumber,
        })

        assert(
          blockNumber >= this.blockHeight,
          'Block number cannot be smaller',
          {
            blockNumber,
            blockHeight: this.blockHeight,
          },
        )

        this.blockHeight = blockNumber

        return async () => {
          await this.$.db.tvsBlockTimestamp.upsertMany([
            {
              configurationId: configurations[0].id,
              chain: configurations[0].properties.chainName,
              timestamp,
              blockNumber,
            },
          ])
          this.logger.info('Saved block number into DB', {
            timestamp: timestamp,
            blockNumber,
          })
          return timestamp
        }
      },
    )
  }

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    const deletedRecords = await this.$.db.tvsBlockTimestamp.deleteByConfigIds(
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
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedRecords =
        await this.$.db.tvsBlockTimestamp.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed records for configuration', {
          id: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }
}
