import { Logger } from '@l2beat/backend-tools'
import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export type BlockTimestampProvider = EtherscanClient | BlockscoutClient

export class BlockTimestampIndexer extends ChildIndexer {
  indexerId: string

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    private readonly stateRepository: IndexerStateRepository,
    private readonly blockTimestampRepository: BlockTimestampRepository,
    private readonly chain: string,
    private readonly minTimestamp: UnixTime,
    private readonly syncOptimizer: SyncOptimizer,
  ) {
    super(logger, [parentIndexer])
    this.indexerId = `block_timestamp_indexer_${chain}`
  }

  override async update(from: number, to: number): Promise<number> {
    const timestamp = this.getTimestampToSync(from)

    if (timestamp.gt(new UnixTime(to))) {
      return to
    }

    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(timestamp)

    this.logger.info('Fetched block number for timestamp', {
      timestamp: timestamp.toNumber(),
      blockNumber,
    })

    await this.blockTimestampRepository.add({
      chain: this.chain,
      timestamp,
      blockNumber,
    })

    this.logger.info('Saved block number for timestamp into DB', {
      timestamp: timestamp.toNumber(),
      blockNumber,
    })

    return timestamp.toNumber()
  }

  private getTimestampToSync(_from: number): UnixTime {
    const timestamp = new UnixTime(_from).toEndOf('hour')

    if (this.syncOptimizer.shouldTimestampBeSynced(timestamp)) {
      return timestamp
    } else {
      return this.getTimestampToSync(timestamp.add(1, 'hours').toNumber())
    }
  }

  override async initialize(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      const safeHeight = this.minTimestamp.toNumber() - 1
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight,
        minTimestamp: this.minTimestamp,
      })
      return safeHeight
    }

    return indexerState.safeHeight
  }

  override async setSafeHeight(
    safeHeight: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.stateRepository.setSafeHeight(this.indexerId, safeHeight, trx)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords =
      await this.blockTimestampRepository.deleteAfterExclusive(
        this.chain,
        new UnixTime(targetHeight),
      )

    this.logger.info('Deleted block timestamps after height', {
      targetHeight,
      deletedRecords,
    })

    return Promise.resolve(targetHeight)
  }
}
