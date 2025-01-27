import type { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'
import type { Clock } from '../../../tools/Clock'

export class DayTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
  ) {
    super(logger)
  }

  override async initialize() {
    this.clock.onNewHour(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  tick(): Promise<number> {
    const day = this.clock.getLastHour().toStartOf('day').toDays()

    return Promise.resolve(day)
  }
}
