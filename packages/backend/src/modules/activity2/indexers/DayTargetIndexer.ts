import { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'
import { Clock } from '../../../tools/Clock'

export class DayTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
  ) {
    super(logger)
  }

  override async scheduleTick() {
    this.clock.onNewHour(() => this.requestTick())
  }

  tick(): Promise<number> {
    const day = this.clock.getLastHour().toStartOf('day').toDays()

    return Promise.resolve(day)
  }
}
