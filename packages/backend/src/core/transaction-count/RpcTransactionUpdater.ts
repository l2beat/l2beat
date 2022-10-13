import { Logger, TaskQueue } from '@l2beat/common'
import { AssessCount } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { Clock } from '../Clock'
import { RpcClient } from './RpcClient'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

const identity = (x: number) => x

interface RpcTransactionUpdaterOpts {
  assessCount?: AssessCount
  startBlock?: number
  workQueueWorkers?: number
  workQueueSizeLimit?: number
}

export class RpcTransactionUpdater implements TransactionCounter {
  private readonly updateQueue: TaskQueue<void>
  private readonly blockQueue: TaskQueue<number>
  private readonly assessCount: AssessCount
  private readonly startBlock: number
  private readonly workQueueSizeLimit: number
  private latestBlock?: bigint

  constructor(
    private readonly rpcClient: RpcClient,
    private readonly blockTransactionCountRepository: BlockTransactionCountRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    readonly projectId: ProjectId,
    private readonly opts?: RpcTransactionUpdaterOpts,
  ) {
    this.logger = logger.for(
      `${RpcTransactionUpdater.name}[${projectId.toString()}]`,
    )
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
        trackEvents: true,
      },
    )
    this.assessCount = opts?.assessCount ?? identity
    this.startBlock = opts?.startBlock ?? 0
    this.workQueueSizeLimit = opts?.workQueueSizeLimit ?? 200_000
  }

  start() {
    this.logger.info('Started', { project: this.projectId.toString() })
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async updateBlock(number: number) {
    const block = await this.rpcClient.getBlock(number)
    const timestamp = new UnixTime(block.timestamp)

    // We download all the blocks, but discard those that are more recent
    // than clock.getLastHour() to avoid dealing with potential reorgs
    if (timestamp.gt(this.clock.getLastHour())) {
      return
    }

    await this.blockTransactionCountRepository.add({
      projectId: this.projectId,
      timestamp,
      blockNumber: block.number,
      count: this.assessCount(block.transactions.length, number),
    })

    this.logger.debug('Block updated', {
      project: this.projectId.toString(),
      blockNumber: block.number,
    })
  }

  async update() {
    this.logger.info('Update started', { project: this.projectId.toString() })

    // Wait until there is no more tasks either waiting or being executed in the queue
    // Otherwise it was prone to race conditions between what is in the queue and what is read
    // from the database using `getMissingRanges`
    await this.blockQueue.waitTilEmpty()

    const missingRanges =
      await this.blockTransactionCountRepository.getMissingRangesByProject(
        this.projectId,
      )
    const latestBlock = await this.rpcClient.getBlockNumber()
    this.latestBlock = latestBlock

    enqueueBlockLoop: for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, this.startBlock);
        i < Math.min(end, Number(latestBlock) + 1);
        i++
      ) {
        if (this.blockQueue.length >= this.workQueueSizeLimit) {
          break enqueueBlockLoop
        }
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued', { project: this.projectId.toString() })
  }

  async getDailyTransactionCounts() {
    return this.blockTransactionCountRepository.getDailyTransactionCount(
      this.projectId,
      this.clock.getLastHour().toStartOf('day'),
    )
  }

  getStatus() {
    return {
      workQueue: this.blockQueue.getStats(),
      startBlock: this.startBlock,
      latestBlock: this.latestBlock?.toString() ?? null,
    }
  }
}
