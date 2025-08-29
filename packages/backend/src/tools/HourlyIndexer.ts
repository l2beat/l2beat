import type { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'

import type { Clock } from './Clock'

export class HourlyIndexer extends RootIndexer {
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
    const time = this.clock.getLastHour()
    await this.options?.onTick?.(time)
    return time
  }
}
