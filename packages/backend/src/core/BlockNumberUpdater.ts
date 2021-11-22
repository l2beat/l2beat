import { UnixTime } from '../model/UnixTime'
import {
  BlockNumberRecord,
  BlockNumberRepository,
} from '../peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../peripherals/etherscan'
import { createEventEmitter } from '../tools/EventEmitter'
import { JobQueue } from '../tools/JobQueue'
import { Logger } from '../tools/Logger'
import { SafeBlockService } from './SafeBlockService'

interface BlockNumberEvents {
  newBlocks: BlockNumberRecord[]
}

export class BlockNumberUpdater {
  private events = createEventEmitter<BlockNumberEvents>()
  private blocks: BlockNumberRecord[] = []
  private timestamps = new Set<number>()
  private jobQueue: JobQueue
  private nextTimestamp: UnixTime

  constructor(
    private minTimestamp: UnixTime,
    private safeBlockService: SafeBlockService,
    private etherscanClient: EtherscanClient,
    private blockNumberRepository: BlockNumberRepository,
    private logger: Logger
  ) {
    if (!minTimestamp.toStartOf('hour').equals(minTimestamp)) {
      throw new Error('minTimestamp must be aligned to full hours')
    }
    this.nextTimestamp = minTimestamp
    this.logger = this.logger.for(this)
    this.jobQueue = new JobQueue({ maxConcurrentJobs: 20 }, this.logger)
  }

  getStatus() {
    return {
      blocks: this.blocks.length,
      ...this.jobQueue.getStats(),
    }
  }

  getBlockList() {
    return [...this.blocks]
  }

  onNewBlocks(fn: (blocks: BlockNumberRecord[]) => void) {
    this.events.on('newBlocks', fn)
    return () => {
      this.events.off('newBlocks', fn)
    }
  }

  async start() {
    const known = await this.blockNumberRepository.getAll()
    this.addBlocks(known.filter((x) => x.timestamp.gte(this.minTimestamp)))

    const safeBlock = this.safeBlockService.getSafeBlock()
    this.addNewJobs(safeBlock.timestamp)

    return this.safeBlockService.onNewSafeBlock((safeBlock) => {
      this.addNewJobs(safeBlock.timestamp)
    })
  }

  private addBlocks(blocks: BlockNumberRecord[]) {
    if (blocks.length === 0) {
      return
    }
    this.blocks.push(...blocks)
    for (const { timestamp } of blocks) {
      this.timestamps.add(timestamp.toNumber())
    }
    if (blocks.length > 1) {
      this.logger.debug('blocks added', { count: blocks.length })
    } else {
      this.logger.debug('block added', {
        number: blocks[0].blockNumber.toString(),
      })
    }
    this.events.emit('newBlocks', blocks)
  }

  private async addNewJobs(maxTimestamp: UnixTime) {
    while (this.nextTimestamp.lt(maxTimestamp)) {
      const jobTimestamp = this.nextTimestamp
      if (!this.timestamps.has(jobTimestamp.toNumber())) {
        this.jobQueue.add({
          name: jobTimestamp.toString(),
          execute: () => this.getBlockNumber(jobTimestamp),
        })
        this.logger.debug('job queued', { timestamp: jobTimestamp.toNumber() })
      }
      this.nextTimestamp = this.nextTimestamp.add(1, 'hours')
    }
  }

  private async getBlockNumber(timestamp: UnixTime) {
    const blockNumber = await this.etherscanClient.getBlockNumberAtOrBefore(
      timestamp
    )
    const block = { timestamp, blockNumber }
    await this.blockNumberRepository.add(block)
    this.addBlocks([block])
  }
}
