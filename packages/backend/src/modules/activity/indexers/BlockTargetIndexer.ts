import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'

export class BlockTargetIndexer extends RootIndexer {
  // used only for runtime invalidation protection
  blockHeight = -1

  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    private readonly db: Database,
    private readonly config: ActivityConfigProject,
    private readonly options?: {
      onTick?: (targetTimestamp: number, blockNumber: number) => Promise<void>
    },
  ) {
    super(
      logger.tag({
        tag: config.id,
        project: config.id,
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
        this.config.chainName,
      )

    await this.checkBlockNumber(blockNumber)

    this.blockHeight = blockNumber
    await this.options?.onTick?.(timestamp, blockNumber)
    return blockNumber
  }

  /**
   * Some RPCs can return smaller block number over time
   * This check is here to prevent invalidation of our infra in such cases
   */
  private async checkBlockNumber(blockNumber: number) {
    if (this.blockHeight === -1) {
      const lastProcessedBlock = await this.db.activity.getLatestProcessedBlock(
        this.config.id,
      )
      if (lastProcessedBlock) {
        this.blockHeight = lastProcessedBlock
      }
    }

    assert(
      blockNumber >= this.blockHeight,
      `Block number cannot be smaller: ${blockNumber} < ${this.blockHeight}`,
    )
  }
}
