import { Logger, TaskQueue, UniqueTaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TransactionCountRepository } from '../../peripherals/database/TransactionCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'

// We want to avoid adding too much tasks to the block queue
// This constraint will be here only to sync transactions on stage
const BLOCK_QUEUE_LIMIT = 200_000

export class RpcTransactionUpdater {
  private updateQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new UniqueTaskQueue(
    this.updateBlock.bind(this),
    this.logger,
    {
      workers: 100,
    },
  )

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
    this.logger.info('Started', { project: this.projectId.toString() })
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async updateBlock(number: number) {
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

    this.logger.info('Block updated', {
      project: this.projectId.toString(),
      blockNumber: block.number,
    })
  }

  async update() {
    this.logger.info('Update started', { project: this.projectId.toString() })

    const missingRanges =
      await this.txCountRepository.getMissingRangesByProject(this.projectId)
    const latestBlock = await this.ethereumClient.getBlockNumber()

    enqueueBlockLoop: for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, 0);
        i < Math.min(end, Number(latestBlock) + 1);
        i++
      ) {
        if (this.blockQueue.length >= BLOCK_QUEUE_LIMIT) {
          break enqueueBlockLoop
        }
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued', { project: this.projectId.toString() })
  }
}
