import { Token } from '../../model'
import { BlockNumberRecord } from '../../peripherals/database/BlockNumberRepository'
import { createEventEmitter } from '../../tools/EventEmitter'
import { JobQueue } from '../../tools/JobQueue'
import { Logger } from '../../tools/Logger'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { AggregatePriceService } from './AggregatePriceService'

interface PriceUpdaterEvents {
  pricesUpdated: { blockNumber: bigint }
}

export class PriceUpdater {
  private events = createEventEmitter<PriceUpdaterEvents>()
  private blockNumbers: bigint[] = []
  private jobQueue: JobQueue

  constructor(
    private tokens: Token[],
    private blockNumberUpdater: BlockNumberUpdater,
    private aggregatePriceService: AggregatePriceService,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
    this.jobQueue = new JobQueue({ maxConcurrentJobs: 20 }, this.logger)
  }

  getStatus() {
    return {
      blocks: this.blockNumbers.length,
      ...this.jobQueue.getStats(),
    }
  }

  getBlockNumbers() {
    return [...this.blockNumbers]
  }

  onPricesUpdated(fn: (event: { blockNumber: bigint }) => void) {
    this.events.on('pricesUpdated', fn)
    return () => this.events.off('pricesUpdated', fn)
  }

  async start() {
    const known = this.blockNumberUpdater.getBlockList()
    this.addNewJobs(known)

    return this.blockNumberUpdater.onNewBlocks((blocks) =>
      this.addNewJobs(blocks)
    )
  }

  private async addNewJobs(blocks: BlockNumberRecord[]) {
    for (const { blockNumber } of blocks) {
      this.jobQueue.add({
        name: blockNumber.toString(),
        execute: () => this.updatePrices(blockNumber),
      })
      this.logger.debug('job queued', { blockNumber: blockNumber.toString() })
    }
  }

  private async updatePrices(blockNumber: bigint) {
    await this.aggregatePriceService.updateAggregatePrices(
      this.tokens,
      blockNumber
    )
    this.blockNumbers.push(blockNumber)
    this.events.emit('pricesUpdated', { blockNumber })
  }
}
