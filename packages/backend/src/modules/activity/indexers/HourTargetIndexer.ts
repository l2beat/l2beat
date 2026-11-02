import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { RootIndexer } from '@l2beat/uif'
import type { Clock } from '../../../tools/Clock'

/** Heights are hours since the epoch, up to the clock's last full hour */
export class HourTargetIndexer extends RootIndexer {
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
    const target = this.clock.getLastHour()

    await this.options?.onTick?.(target)

    return target / UnixTime.HOUR
  }
}
