import {} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { DEFAULT_RETRY_FOR_TVL } from '../../../tools/uif/defaultRetryForTvl'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { BlockTimestampService } from '../services/BlockTimestampService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface BlockTimestampIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  blockTimestampService: BlockTimestampService
  blockTimestampRepository: BlockTimestampRepository
  chain: string
  syncOptimizer: SyncOptimizer
}

export class BlockTimestampIndexer extends ManagedChildIndexer {
  constructor(private readonly $: BlockTimestampIndexerDeps) {
    const logger = $.logger.tag($.tag)
    const name = 'block_timestamp_indexer'
    super({
      ...$,
      name,
      logger,
      updateRetryStrategy: DEFAULT_RETRY_FOR_TVL,
      configHash: $.minHeight.toString(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp.toNumber() > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        optimizedTimestamp: timestamp.toNumber(),
      })
      return to
    }

    const blockNumber =
      await this.$.blockTimestampService.getBlockNumberAtOrBefore(timestamp)

    this.logger.info('Fetched block number for timestamp', {
      timestamp: timestamp.toNumber(),
      blockNumber,
    })

    await this.$.blockTimestampRepository.add({
      chain: this.$.chain,
      timestamp,
      blockNumber,
    })

    this.logger.info('Saved block number for timestamp into DB', {
      timestamp: timestamp.toNumber(),
      blockNumber,
    })

    return timestamp.toNumber()
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords =
      await this.$.blockTimestampRepository.deleteAfterExclusive(
        this.$.chain,
        new UnixTime(targetHeight),
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
