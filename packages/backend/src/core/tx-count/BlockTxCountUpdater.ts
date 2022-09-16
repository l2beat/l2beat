import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TxCountRepository } from '../../peripherals/database/TxCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'

export class BlockTxCountUpdater {
  private updateQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new TaskQueue(this.getBlock.bind(this), this.logger, {
    workers: 100,
  })
  private latestQueuedBlock = 0

  constructor(
    private ethereumClient: EthereumClient,
    private txCountRepository: TxCountRepository,
    private clock: Clock,
    private logger: Logger,
    private projectId: ProjectId,
  ) {
    this.logger = logger.for(this)
  }

  async getBlock(number: number) {
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

  start() {
    this.logger.info('Started')
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async update() {
    this.logger.info('Update started')

    const missingBlocks = await this.txCountRepository.getMissingByProject(
      this.projectId,
      this.latestQueuedBlock,
    )
    for (const block of missingBlocks) {
      this.blockQueue.addToBack(block)
    }

    const newestBlock = await this.ethereumClient.getBlockNumber()
    let lastBlockNumber = await this.firstBlockToUpdate()

    while (lastBlockNumber < Number(newestBlock)) {
      lastBlockNumber++
      this.blockQueue.addToBack(lastBlockNumber)
    }
    this.latestQueuedBlock = lastBlockNumber

    this.logger.info('Update completed')
  }

  private async firstBlockToUpdate() {
    const latestUpdatedBlock = await this.txCountRepository.findLatestByProject(
      this.projectId,
    )

    if (!latestUpdatedBlock) {
      return this.latestQueuedBlock
    }

    return Math.max(latestUpdatedBlock.blockNumber, this.latestQueuedBlock)
  }
}
