import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TransactionCountRepository } from '../../peripherals/database/TransactionCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'

export class RpcTransactionUpdater {
  private updateQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new TaskQueue(this.updateBlock.bind(this), this.logger, {
    workers: 100,
  })
  private queuedBlocks = new Set<number>()

  constructor(
    private ethereumClient: EthereumClient,
    private txCountRepository: TransactionCountRepository,
    private clock: Clock,
    private logger: Logger,
    private projectId: ProjectId,
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
    this.queuedBlocks.delete(number)
    const block = await this.ethereumClient.getBlock(number)
    const timestamp = new UnixTime(block.timestamp)

    // We download all the blocks, but discard those that are more recent
    // than clock.getLastHour() to avoid dealing with potential reorgs
    if (timestamp.gt(this.clock.getLastHour())) {
      return
    }

    await this.txCountRepository.add({
      projectId: this.projectId,
      timestamp,
      blockNumber: block.number,
      count: block.transactions.length,
    })
  }

  async update() {
    this.logger.info('Update started')

    const missingRanges =
      await this.txCountRepository.getMissingRangesByProject(this.projectId)
    const latestBlock = await this.ethereumClient.getBlockNumber()

    for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, 0);
        i < Math.min(end, Number(latestBlock) + 1);
        i++
      ) {
        this.enqueueBlock(i)
      }
    }

    this.logger.info('Update enqueued')
  }

  private enqueueBlock(number: number) {
    if (!this.queuedBlocks.has(number)) {
      this.blockQueue.addToBack(number)
      this.queuedBlocks.add(number)
    }
  }
}
