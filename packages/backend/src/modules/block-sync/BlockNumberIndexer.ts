import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { Indexer, RootIndexer } from '@l2beat/uif'

export class BlockNumberIndexer extends RootIndexer {
  blockHeight = -1

  constructor(
    private readonly blockProvider: BlockProvider,
    chain: string,
    logger: Logger,
    private checkIntervalSeconds: number,
  ) {
    super(logger.tag({ chain }), {
      tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override initialize() {
    setInterval(() => this.requestTick(), this.checkIntervalSeconds * 1000)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    const blockNumber = await this.blockProvider.getLatestBlockNumber()
    if (blockNumber > this.blockHeight) {
      this.blockHeight = blockNumber
      this.logger.info('Advanced block number', { blockNumber })
    }
    return this.blockHeight
  }
}
