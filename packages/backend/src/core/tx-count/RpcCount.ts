import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TxCountRepository } from '../../peripherals/database/TxCountRepository'
import { RpcClient } from '../../peripherals/ethereum/RpcClient'
import { Clock } from '../Clock'

export class RpcCount {
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new TaskQueue(this.getBlock.bind(this), this.logger)
  private unsafeBlockReached = false

  constructor(
    private rpcClient: RpcClient,
    private txCountRepository: TxCountRepository,
    private clock: Clock,
    private logger: Logger,
    private projectId: ProjectId,
  ) {
    this.logger = logger.for(this)
  }

  async getBlock(number: number) {
    const block = await this.rpcClient.getBlock(number)
    const timestamp = new UnixTime(block.timestamp)

    if (timestamp.gt(this.clock.getLastHour())) {
      this.unsafeBlockReached = true
      return
    }

    await this.txCountRepository.add({
      projectId: this.projectId,
      timestamp: new UnixTime(block.timestamp),
      blockNumber: block.number,
      count: block.transactions.length,
    })
  }

  async update() {
    this.logger.info('Update started')
    const lastBlock = await this.txCountRepository.findLatestByProject(
      this.projectId,
    )
    const latestBlock = await this.rpcClient.getBlockNumber()
    let lastBlockNumber = lastBlock ? lastBlock.blockNumber : 0

    while (!this.unsafeBlockReached && lastBlockNumber < Number(latestBlock)) {
      this.blockQueue.addToBack(lastBlockNumber)
      lastBlockNumber++
    }
    this.logger.info('Update completed')
  }

  start() {
    this.logger.info('Started')
    return this.clock.onEveryHour(() => {
      this.unsafeBlockReached = false
      this.taskQueue.addIfEmpty()
    })
  }
}
