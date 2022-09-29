import { Logger, TaskQueue, UniqueTaskQueue } from '@l2beat/common'
import { AssessCount } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'

import { RpcTransactionCountRepository } from '../../peripherals/database/RpcTransactionCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'
import { TransactionCounter } from './TransactionCounter'

// We want to avoid adding too much tasks to the block queue
// This constraint will be here only to sync transactions on stage
const BLOCK_QUEUE_LIMIT = 200_000

const identity = (x: number) => x

export class RpcTransactionUpdater implements TransactionCounter {
  private updateQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new UniqueTaskQueue(
    this.updateBlock.bind(this),
    this.logger,
    {
      workers: 100,
    },
  )
  private assessCount: AssessCount

  constructor(
    private ethereumClient: EthereumClient,
    private rpcTransactionCountRepository: RpcTransactionCountRepository,
    private clock: Clock,
    private logger: Logger,
    private projectId: ProjectId,
    assessCount?: AssessCount,
  ) {
    this.logger = logger.for(this)
    this.assessCount = assessCount ?? identity
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

    const count = block.transactions.length

    await this.rpcTransactionCountRepository.add({
      projectId: this.projectId,
      timestamp,
      blockNumber: block.number,
      count: this.assessCount(count, number),
    })

    this.logger.debug('Block updated', {
      project: this.projectId.toString(),
      blockNumber: block.number,
    })
  }

  async update() {
    this.logger.info('Update started', { project: this.projectId.toString() })

    const missingRanges =
      await this.rpcTransactionCountRepository.getMissingRangesByProject(
        this.projectId,
      )
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

  async getDailyTransactionCounts() {
    const counts =
      await this.rpcTransactionCountRepository.getDailyTransactionCount(
        this.projectId,
      )
    return {
      projectId: this.projectId,
      counts,
    }
  }
}
