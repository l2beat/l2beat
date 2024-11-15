import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import { Clock } from '../../../tools/Clock'
import { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'

export class BlockTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    projectId: ProjectId,
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

    return blockNumber
  }
}
