import { assert, Logger } from '@l2beat/backend-tools'
import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { SyncOptimizer } from './SyncOptimizer'

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

  override async start(): Promise<void> {
    this.logger.info('Starting...')
    await this.initialize()
    await super.start()
    this.logger.info('Started')
  }

  override async update(_from: number, _to: number): Promise<number> {
    this.logger.info('Updating...')

    const timestamp = this.getTimestampToSync(_from)

    if (timestamp.gt(new UnixTime(_to))) {
      return _to
    }

    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(timestamp)

    await this.blockTimestampRepository.add({
      chain: this.chain,
      timestamp,
      blockNumber,
    })

    this.logger.info('Updated')
    return timestamp.toNumber()
  }

  private getTimestampToSync(_from: number): UnixTime {
    const nextTimestamp = this.getNextTimestamp(_from)

    if (this.syncOptimizer.shouldTimestampBeSynced(nextTimestamp)) {
      return nextTimestamp
    } else {
      return this.getTimestampToSync(nextTimestamp.toNumber())
    }
  }

  private getNextTimestamp(_from: number): UnixTime {
    if (_from === 0) {
      return this.minTimestamp.toEndOf('hour')
    }

    return new UnixTime(_from).toNext('hour')
  }

  override async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )
    assert(indexerState, 'Indexer state should be initialized')

    return indexerState?.safeHeight
  }

  override async setSafeHeight(
    safeHeight: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.stateRepository.setSafeHeight(this.indexerId, safeHeight, trx)
  }

  async initialize() {
    this.logger.info('Initializing...')

    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight: 0,
        minTimestamp: this.minTimestamp,
      })
      return
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.minTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    this.logger.info('Initialized')
  }

  override async invalidate(targetHeight: number): Promise<number> {
    this.logger.info('Invalidating...')

    await this.blockTimestampRepository.deleteAfterExclusive(
      this.chain,
      new UnixTime(targetHeight),
    )

    this.logger.info('Invalidated')

    return Promise.resolve(targetHeight)
  }
}
