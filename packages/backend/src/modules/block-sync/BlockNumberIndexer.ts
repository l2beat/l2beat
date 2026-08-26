import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { withBlockSyncRpcMetricsContext } from './blockSyncRpcMetrics'
import { TipBlockTracker } from './TipBlockTracker'

export class BlockNumberIndexer extends RootIndexer {
  blockHeight = -1
  private readonly tipTracker: TipBlockTracker

  constructor(
    private readonly blockProvider: BlockProvider,
    chain: string,
    logger: Logger,
    private delayFromTipInSeconds: number,
    private checkIntervalMs = 10_000,
  ) {
    super(logger.tag({ chain, tag: chain }), {
      tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
    // The tip is already held delayFromTipInSeconds back, so trailing the exact
    // block by one more tick is free and saves a lookup.
    this.tipTracker = new TipBlockTracker(
      blockProvider,
      Math.ceil(checkIntervalMs / 1000),
    )
  }

  override initialize() {
    setInterval(() => this.requestTick(), this.checkIntervalMs)
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    return await withBlockSyncRpcMetricsContext(
      'blockSync.tip',
      {
        chain: this.blockProvider.chain,
      },
      async () => {
        const timestamp = UnixTime.now() - this.delayFromTipInSeconds
        const blockNumber =
          await this.tipTracker.getBlockNumberAtOrBefore(timestamp)
        if (blockNumber > this.blockHeight) {
          this.blockHeight = blockNumber
          this.logger.info('Advanced block number', { blockNumber })
        }
        return this.blockHeight
      },
    )
  }
}
