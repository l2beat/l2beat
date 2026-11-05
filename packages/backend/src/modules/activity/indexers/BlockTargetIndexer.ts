import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { BlockTimestampProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'

/** Finality moves once per epoch, about every 6.4 minutes */
const FINALIZED_REFRESH_MS = UnixTime.MINUTE * 1000

export interface FinalizedBlock {
  number: number
  timestamp: UnixTime
}

export class BlockTargetIndexer extends RootIndexer {
  // used only for runtime invalidation protection
  blockHeight = -1
  /**
   * A lagging RPC can answer with an older finalized block, which must not
   * move the target back and invalidate the counts
   */
  private highestFinalized: FinalizedBlock | undefined

  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    private readonly db: Database,
    private readonly config: ActivityConfigProject,
    private readonly options?: {
      onTick?: (targetTimestamp: number, blockNumber: number) => Promise<void>
      /**
       * Follows this block instead of the last hour, so that the counts reach
       * minutes back rather than hours
       */
      getFinalizedBlock?: () => Promise<FinalizedBlock>
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
    if (this.options?.getFinalizedBlock) {
      this.clock.every(FINALIZED_REFRESH_MS, () => this.requestTick())
    } else {
      this.clock.onNewHour(() => this.requestTick())
    }
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    const getFinalizedBlock = this.options?.getFinalizedBlock
    return await withCoreFeatureRpcMetricsContext(
      'activity.target',
      {
        chain: this.config.chainName,
        mode: getFinalizedBlock ? 'finalized' : 'block',
      },
      async () => {
        const { timestamp, blockNumber } = getFinalizedBlock
          ? await this.getFinalizedTarget(getFinalizedBlock)
          : await this.getLastHourTarget()

        this.blockHeight = blockNumber
        await this.options?.onTick?.(timestamp, blockNumber)
        return blockNumber
      },
    )
  }

  private async getLastHourTarget() {
    const timestamp = this.clock.getLastHour()
    this.logger.info('Getting block number for timestamp', { timestamp })

    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(
        timestamp,
        this.config.chainName,
      )

    await this.checkBlockNumber(blockNumber)
    return { timestamp, blockNumber }
  }

  /**
   * The target timestamp stays on the hourly clock, which already lags more
   * than finality does, so pages of other projects that wait for this one
   * don't change. Only when finality stalls for over an hour does it hold the
   * target back to the hour of the finalized block
   */
  private async getFinalizedTarget(
    getFinalizedBlock: () => Promise<FinalizedBlock>,
  ) {
    const finalized = await getFinalizedBlock()
    if (this.highestFinalized === undefined) {
      await this.checkBlockNumber(finalized.number)
    }
    if (
      this.highestFinalized === undefined ||
      finalized.number > this.highestFinalized.number
    ) {
      this.highestFinalized = finalized
    }

    const highest = this.highestFinalized
    const timestamp = Math.min(
      this.clock.getLastHour(),
      UnixTime.toStartOf(highest.timestamp, 'hour'),
    )
    this.logger.info('Following finalized block', {
      blockNumber: highest.number,
      blockTimestamp: highest.timestamp,
      timestamp,
    })
    return { timestamp, blockNumber: highest.number }
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

    assert(blockNumber >= this.blockHeight, 'Block number cannot be smaller', {
      blockNumber,
      blockHeight: this.blockHeight,
    })
  }
}
