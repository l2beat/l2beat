import { Logger } from '@l2beat/backend-tools'
import { ProjectId } from '@l2beat/shared-pure'
import { RootIndexer } from '@l2beat/uif'
import { Clock } from '../../../tools/Clock'
import { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'

export class BlockTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
    projectId: ProjectId,
  ) {
    super(logger.tag(projectId))
  }

  override async initialize() {
    this.clock.onNewHour(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  async tick(): Promise<number> {
    const timestamp = this.clock.getLastHour()
    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(timestamp)

    return blockNumber
  }
}
