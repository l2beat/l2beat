import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { Clock } from '../../../tools/Clock'
import type { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'

export class BlockTargetIndexer extends RootIndexer {
  // used only for runtime invalidation protection
  blockHeight = -1

  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    private readonly db: Database,
    private projectId: ProjectId,
  ) {
    super(
      logger.tag({
        tag: projectId,
        project: projectId,
      }),
      {
        tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
    )
  }

  override async initialize() {
    this.clock.onNewHour(() => this.requestTick())
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    const timestamp = this.clock.getLastHour()
    this.logger.info('Getting block number for timestamp', { timestamp })

    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(timestamp)

    await this.checkBlockNumber(blockNumber)

    this.blockHeight = blockNumber
    return blockNumber
  }

  /**
   * Some RPCs can return smaller block number over time
   * This check is here to prevent invalidation of our infra in such cases
   */
  private async checkBlockNumber(blockNumber: number) {
    if (this.blockHeight === -1) {
      const lastProcessedBlock = await this.db.activity.getLatestProcessedBlock(
        this.projectId,
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
