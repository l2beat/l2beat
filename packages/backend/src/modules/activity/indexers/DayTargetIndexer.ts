import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
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
    const day = UnixTime.toDays(
      UnixTime.toStartOf(this.clock.getLastHour(), 'day'),
    )

    return Promise.resolve(day)
  }
}
