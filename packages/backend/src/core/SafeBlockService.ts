import { UnixTime } from '../model/UnixTime'
import { IEthereumClient } from '../peripherals/ethereum/EthereumClient'
import { createEventEmitter } from '../tools/EventEmitter'
import { Logger } from '../tools/Logger'

export interface SafeBlock {
  blockNumber: BigInt
  timestamp: UnixTime
}

interface SafeBlockEvents {
  newBlock: SafeBlock
}

export interface ISafeBlockService {
  getSafeBlock(): SafeBlock
  onNewSafeBlock(fn: (block: SafeBlock) => void): () => void
}

export class SafeBlockService implements ISafeBlockService {
  private events = createEventEmitter<SafeBlockEvents>()
  private safeBlock: SafeBlock | undefined

  constructor(
    private refreshIntervalMs: number,
    private blockOffset: bigint,
    private ethereumClient: IEthereumClient,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async start() {
    await this.updateSafeBlock()
    return this.startBackgroundWork()
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
    this.events.emit('newBlock', this.safeBlock)
  }
}
