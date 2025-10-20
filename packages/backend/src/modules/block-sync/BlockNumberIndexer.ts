import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'

export class BlockNumberIndexer extends RootIndexer {
  blockHeight = -1

  constructor(
    private readonly blockProvider: BlockProvider,
    chain: string,
    logger: Logger,
    private delayFromTipInSeconds: number,
    private checkIntervalMs = 10_000,
  ) {
    super(logger.tag({ chain }), {
      tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override initialize() {
    setInterval(() => this.requestTick(), this.checkIntervalMs)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    const timestamp = UnixTime.now() - this.delayFromTipInSeconds
    const blockNumber =
      await this.blockProvider.getBlockNumberAtOrBefore(timestamp)
    if (blockNumber > this.blockHeight) {
      this.blockHeight = blockNumber
      this.logger.info('Advanced block number', { blockNumber })
    }
    return this.blockHeight
  }
}
