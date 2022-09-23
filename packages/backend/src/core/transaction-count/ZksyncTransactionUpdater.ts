import { Logger, TaskQueue, UniqueTaskQueue } from '@l2beat/common'

import {
  ZksyncTransactionRecord,
  ZksyncTransactionsRepository,
} from '../../peripherals/database/ZksyncTransactionsRepository'
import { ZksyncClient } from '../../peripherals/zksync'
import { Clock } from '../Clock'

export class ZksyncTransactionUpdater {
  private updateQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new UniqueTaskQueue(
    this.updateBlock.bind(this),
    this.logger,
    {
      workers: 100,
    },
  )

  constructor(
    private zksyncClient: ZksyncClient,
    private zksyncTransactionRepository: ZksyncTransactionsRepository,
    private clock: Clock,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  start() {
    this.logger.info('Started')
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async updateBlock(number: number) {
    const transactions = await this.zksyncClient.getTransactionsInBlock(number)

    const records: ZksyncTransactionRecord[] = transactions.map(
      (transaction) => ({
        blockIndex: transaction.blockIndex,
        blockNumber: number,
        timestamp: transaction.createdAt,
      }),
    )

    await this.zksyncTransactionRepository.addMany(records)
    this.logger.info('Block updated', {
      blockNumber: number,
      transactionCount: records.length,
    })
  }

  async update() {
    this.logger.info('Update started')

    const missingRanges =
      await this.zksyncTransactionRepository.getMissingRanges()
    const latestBlock = await this.zksyncClient.getLatestBlock()

    for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, 0);
        i < Math.min(end, Number(latestBlock) + 1);
        i++
      ) {
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued')
  }
}
