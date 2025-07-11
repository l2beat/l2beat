import type { BlockTimestampProvider } from '@l2beat/shared'
import {
  assert,
  type Configuration,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import type { BlockTimestampConfig } from '../types'

interface BlockTimestampIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<BlockTimestampConfig>, 'name'> {
  syncOptimizer: SyncOptimizer
  blockTimestampProvider: BlockTimestampProvider
}

export class BlockTimestampIndexer extends ManagedMultiIndexer<BlockTimestampConfig> {
  // used only for runtime invalidation protection
  blockHeight = 0

  constructor(private readonly $: BlockTimestampIndexerDeps) {
    assert(
      $.configurations.length === 1,
      'This indexer should take only one configuration',
    )
    super({
      ...$,
      name: INDEXER_NAMES.TVS_BLOCK_TIMESTAMP,
      tags: {
        tag: $.configurations[0].properties.chainName,
        chain: $.configurations[0].properties.chainName,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<BlockTimestampConfig>[],
  ) {
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
      `Block number cannot be smaller than previously fetched: ${blockNumber} < ${this.blockHeight}`,
    )

    this.blockHeight = blockNumber

    return async () => {
      await this.$.db.tvsBlockTimestamp.insertMany([
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
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.tvsBlockTimestamp.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(configuration.from),
          UnixTime(configuration.to),
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted records for configuration', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }
}
