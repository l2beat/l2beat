import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import type { BlockTimestampIndexerDeps } from './types'

export class BlockTimestampIndexer extends ManagedChildIndexer {
  // used only for runtime invalidation protection
  blockHeight = 0

  constructor(private readonly $: BlockTimestampIndexerDeps) {
    super({
      ...$,
      name: 'block_timestamp_indexer',
      tags: {
        tag: $.chain,
        chain: $.chain,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      configHash: $.minHeight.toString(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        optimizedTimestamp: timestamp,
      })
      return to
    }

    const blockNumber =
      await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(timestamp)

    this.logger.info('Fetched block number for timestamp', {
      timestamp: timestamp,
      blockNumber,
    })

    assert(
      blockNumber >= this.blockHeight,
      `Block number cannot be smaller: ${blockNumber} < ${this.blockHeight}`,
    )

    await this.$.db.blockTimestamp.insert({
      chain: this.$.chain,
      timestamp,
      blockNumber,
    })

    this.logger.info('Saved block number for timestamp into DB', {
      timestamp: timestamp,
      blockNumber,
    })

    this.blockHeight = blockNumber
    return timestamp
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords = await this.$.db.blockTimestamp.deleteAfterExclusive(
      this.$.chain,
      UnixTime(targetHeight),
    )

    if (deletedRecords > 0) {
      this.logger.info('Deleted block timestamps after height', {
        targetHeight,
        deletedRecords,
      })
    }

    return Promise.resolve(targetHeight)
  }
}
