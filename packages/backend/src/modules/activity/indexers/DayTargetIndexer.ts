import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { RootIndexer } from '@l2beat/uif'
import type { Clock } from '../../../tools/Clock'

export class DayTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly options?: {
      onTick?: (targetTimestamp: number) => Promise<void>
    },
  ) {
    super(logger)
  }

  override async initialize() {
    this.clock.onNewHour(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  async tick(): Promise<number> {
    const target = UnixTime.toStartOf(this.clock.getLastHour(), 'day')
    const day = UnixTime.toDays(target)

    await this.options?.onTick?.(target)

    return Promise.resolve(day)
  }
}
