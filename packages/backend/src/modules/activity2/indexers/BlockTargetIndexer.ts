import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { RootIndexer } from '@l2beat/uif'
import { Clock } from '../../../tools/Clock'
import { BlockTimestampProvider } from '../../tvl/services/BlockTimestampProvider'

export class BlockTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly blockTimestampProvider: BlockTimestampProvider,
  ) {
    super(logger)
  }

  override async initialize() {
    this.clock.onNewHour(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  async tick(): Promise<number> {
    const time = this.clock.getLastHour().toNumber()
    const blockNumber =
      await this.blockTimestampProvider.getBlockNumberAtOrBefore(
        new UnixTime(time),
      )

    return blockNumber
  }
}
