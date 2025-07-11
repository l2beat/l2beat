import type { Logger } from '@l2beat/backend-tools'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { Clock } from '../../../tools/Clock'

/**
 * This indexer is almost an exact copy of the Activity's BlockTargetIndexer.
 * The only difference is lack of height invalidation fail-safe which is not needed for DA indexers.
 * (at least at this point)
 */
export class BlockTargetIndexer extends RootIndexer {
  // used only for runtime invalidation protection
  blockHeight = 0

  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    readonly daLayer: string,
  ) {
    super(
      logger.tag({
        tag: daLayer,
        project: daLayer,
      }),
      {
        tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
    )
  }

  override initialize() {
    this.clock.onNewHour(() => this.requestTick())
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    const timestamp = this.clock.getLastHour()
    this.logger.info('Getting block number for timestamp', { timestamp })
    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(
        timestamp,
        this.daLayer,
      )

    assert(
      blockNumber >= this.blockHeight,
      `Block number cannot be smaller: ${blockNumber} < ${this.blockHeight}`,
    )

    this.blockHeight = blockNumber
    return blockNumber
  }
}
