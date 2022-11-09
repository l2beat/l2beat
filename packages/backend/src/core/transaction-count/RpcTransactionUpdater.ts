import { Logger, TaskQueue } from '@l2beat/common'
import { AssessCount } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { waitUntilDefined } from '../../tools/waitUntilDefined'
import { Clock } from '../Clock'
import { getFilledDailyCounts } from './getFilledDailyCounts'
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
  private latestBlock?: { number: number; timestamp: number }

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

    await this.blockQueue.waitTilEmpty()

    this.latestBlock = await this.rpcClient.getBlockAtOrBefore(
      this.clock.getLastHour(),
      await this.getLatestBlockSearchStart(),
    )

    const gaps = await this.blockTransactionCountRepository.getGapsByProject(
      this.projectId,
      this.startBlock,
      this.latestBlock.number,
    )

    enqueueBlockLoop: for (const [start, end] of gaps) {
      for (let i = start; i <= end; i++) {
        if (this.blockQueue.length >= this.workQueueSizeLimit) {
          break enqueueBlockLoop
        }
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued', { project: this.projectId.toString() })
  }

  async getDailyCounts() {
    const start = Date.now()
    this.logger.info('Daily count started')
    const [counts, tip] = await Promise.all([
      await this.blockTransactionCountRepository.getDailyCountsByProject(
        this.projectId,
      ),
      await this.blockTransactionCountRepository.findTipByProject(
        this.projectId,
      ),
    ])
    const latestBlock = await waitUntilDefined(() => this.latestBlock)
    const result = getFilledDailyCounts(
      UnixTime.now(),
      counts,
      new UnixTime(latestBlock.timestamp),
      tip?.timestamp,
    )
    this.logger.info('Daily count finished', { timeMs: Date.now() - start })
    return result
  }

  async getStatus() {
    const fullySyncedTip = (await this.getDailyCounts()).at(-1)
    return {
      workQueue: this.blockQueue.getStats(),
      startBlock: this.startBlock,
      latestBlock: this.latestBlock
        ? {
            number: this.latestBlock.number,
            timestamp: this.latestBlock.timestamp.toString(),
          }
        : null,
      fullySyncedTip: fullySyncedTip?.timestamp.toDate().toISOString() ?? null,
    }
  }

  private async getLatestBlockSearchStart() {
    // Some blockchains tend to get big in terms of blocks. Speed up search
    // as much as we can by setting search space start point (ordered by priority):
    // 1. Last search result (optimistic, most-common),
    // 2. Max fetched block (start of the application - no result in memory yet),
    // 3. Start block (first call ever)
    return (
      this.latestBlock?.number ??
      (await this.blockTransactionCountRepository.getMaxBlockNumberByProject(
        this.projectId,
      )) ??
      this.startBlock
    )
  }
}
