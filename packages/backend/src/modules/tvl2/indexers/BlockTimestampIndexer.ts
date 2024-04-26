import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export type BlockTimestampProvider = EtherscanClient | BlockscoutClient

export interface BlockTimestampIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  blockTimestampProvider: BlockTimestampProvider
  blockTimestampRepository: BlockTimestampRepository
  chain: string
  syncOptimizer: SyncOptimizer
}

export class BlockTimestampIndexer extends ManagedChildIndexer {
  constructor(private readonly $: BlockTimestampIndexerDeps) {
    const logger = $.logger.tag($.chain)
    const name = 'block_timestamp_indexer'
    super({ ...$, name, logger })
  }

  override async update(from: number, to: number): Promise<number> {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(
      new UnixTime(from),
    )

    if (timestamp.gt(new UnixTime(to))) {
      return to
    }

    const blockNumber =
      await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(timestamp)

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

    this.logger.info('Deleted block timestamps after height', {
      targetHeight,
      deletedRecords,
    })

    return Promise.resolve(targetHeight)
  }
}
