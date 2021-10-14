import { UnixTime } from '../model/UnixTime'
import { EthereumClient } from '../peripherals/ethereum/EthereumClient'
import { createEventEmitter } from '../tools/EventEmitter'
import { Logger } from '../tools/Logger'

export interface SafeBlock {
  blockNumber: BigInt
  timestamp: UnixTime
}

interface SafeBlockEvents {
  newBlock: SafeBlock
}

export class SafeBlockService {
  private events = createEventEmitter<SafeBlockEvents>()
  private safeBlock: SafeBlock | undefined
  private started = false
  private lastUpdatedAt = new Date().toISOString()

  constructor(
    private refreshIntervalMs: number,
    private blockOffset: bigint,
    private ethereumClient: EthereumClient,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async start() {
    this.started = true
    this.lastUpdatedAt = new Date().toISOString()
    await this.updateSafeBlock()
    return this.startBackgroundWork()
  }

  getStatus() {
    return {
      lastUpdatedAt: this.lastUpdatedAt,
      started: this.started,
      safeBlockNumber: this.safeBlock?.blockNumber.toString() ?? null,
      safeBlockTime: this.safeBlock?.timestamp.toDate().toISOString() ?? null,
      safeBlockTimestamp: this.safeBlock?.timestamp.toNumber() ?? null,
    }
  }

  getSafeBlock() {
    if (!this.safeBlock) {
      throw new Error('Not started')
    }
    return this.safeBlock
  }

  onNewSafeBlock(fn: (block: SafeBlock) => void) {
    this.events.on('newBlock', fn)
    return () => {
      this.events.off('newBlock', fn)
    }
  }

  private startBackgroundWork() {
    const run = async () => {
      try {
        await this.updateSafeBlock()
      } catch (e) {
        this.logger.error(e)
      }
    }
    const interval = setInterval(run, this.refreshIntervalMs)
    return () => clearInterval(interval)
  }

  private async updateSafeBlock() {
    const lastBlock = await this.ethereumClient.getBlockNumber()
    // we use a block in the past to not have to worry about reorgs
    const blockNumber = lastBlock - this.blockOffset
    const { timestamp } = await this.ethereumClient.getBlock(blockNumber)
    this.safeBlock = { timestamp, blockNumber }
    this.lastUpdatedAt = new Date().toISOString()
    this.logger.info('safe block found', { timestamp: timestamp.toNumber() })
    this.events.emit('newBlock', this.safeBlock)
  }
}
