import { INDEXER_NAMES } from '@l2beat/backend-shared'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import {
  assert,
  type Configuration,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../../tvl/utils/SyncOptimizer'

export interface BlockTimestampConfig {
  chain: string
}

interface BlockTimestampIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<BlockTimestampConfig>, 'name'> {
  db: Database
  syncOptimizer: SyncOptimizer
  blockTimestampProvider: BlockTimestampProvider
}

export class BlockTimestampIndexer extends ManagedMultiIndexer<BlockTimestampConfig> {
  // used only for runtime invalidation protection
  blockHeight = 0

  constructor(private readonly $: BlockTimestampIndexerDeps) {
    assert(
      $.configurations.length === 1,
      `This indexer should take only one configuration`,
    )
    super({
      ...$,
      name: INDEXER_NAMES.TVS_BLOCK_TIMESTAMP,
      tags: {
        tag: $.configurations[0].properties.chain,
        chain: $.configurations[0].properties.chain,
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
        configurations[0].properties.chain,
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
          chain: configurations[0].properties.chain,
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

      this.logger.info('Deleted amounts for configuration', {
        id: configuration.id,
        from: configuration.from,
        to: configuration.to,
        deletedRecords,
      })
    }
  }
}
