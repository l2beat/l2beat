import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import {
  ZksyncTransactionRecord,
  ZksyncTransactionRepository,
} from '../../peripherals/database/ZksyncTransactionRepository'
import { ZksyncClient } from '../../peripherals/zksync'
import { Clock } from '../Clock'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

interface ZksyncTransactionUpdaterOpts {
  workQueueWorkers?: number
}

export class ZksyncTransactionUpdater implements TransactionCounter {
  readonly projectId = ProjectId.ZKSYNC

  private readonly updateQueue: TaskQueue<void>
  private readonly blockQueue: TaskQueue<number>

  constructor(
    private readonly zksyncClient: ZksyncClient,
    private readonly zksyncTransactionRepository: ZksyncTransactionRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly opts?: ZksyncTransactionUpdaterOpts,
  ) {
    this.logger = logger.for(this)
    this.updateQueue = new TaskQueue<void>(
      () => this.update(),
      this.logger.for('updateQueue'),
    )
    this.blockQueue = new TaskQueue(
      (block) => this.updateBlock(block),
      this.logger.for('blockQueue'),
      {
        workers: this.opts?.workQueueWorkers,
        shouldRetry: BACK_OFF_AND_DROP,
      },
    )
  }

  start() {
    this.logger.info('Started')
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async updateBlock(blockNumber: number) {
    const transactions = await this.zksyncClient.getTransactionsInBlock(
      blockNumber,
    )

    // Block 427 has a duplicated blockIndex
    // so I fixed it
    if (blockNumber === 427) {
      transactions[1].blockIndex = transactions[1].blockIndex + 1
    }

    const records: ZksyncTransactionRecord[] = transactions.map(
      (transaction) => ({
        blockNumber,
        blockIndex: transaction.blockIndex,
        timestamp: transaction.createdAt,
      }),
    )

    await this.zksyncTransactionRepository.addMany(records)
    this.logger.debug('Block updated', {
      blockNumber,
      transactionCount: records.length,
    })
  }

  async update() {
    this.logger.info('Update started')

    await this.blockQueue.waitTilEmpty()

    const missingRanges =
      await this.zksyncTransactionRepository.getMissingRanges()
    const latestBlock = await this.zksyncClient.getLatestBlock()

    for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, 1);
        i < Math.min(end, Number(latestBlock) + 1);
        i++
      ) {
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued')
  }

  async getDailyTransactionCounts() {
    return this.zksyncTransactionRepository.getDailyTransactionCount()
  }

  async getStatus() {
    return {
      queuedJobsCount: this.blockQueue.length,
      missingRanges: await this.zksyncTransactionRepository.getMissingRanges(),
      busyWorkers: this.blockQueue.getBusyWorkers(),
    }
  }
}
