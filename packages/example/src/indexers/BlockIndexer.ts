import { RootIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

export class BlockchainClient {
  async getBlockNumber(): Promise<number> {
    return Promise.resolve(0)
  }
}

export class BlockIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly blockchainClient: BlockchainClient,
  ) {
    super(logger)
    this.logger = this.logger.for(this)
  }

  override async start(): Promise<void> {
    await super.start()
    setInterval(() => this.requestTick(), 1000)
  }

  override async tick(): Promise<number> {
    return this.blockchainClient.getBlockNumber()
  }
}
