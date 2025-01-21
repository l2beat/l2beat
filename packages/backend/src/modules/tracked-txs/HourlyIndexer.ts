import type { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'

import type { Clock } from '../../tools/Clock'

export class HourlyIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly module?: string,
  ) {
    super(logger)
  }

  override async initialize() {
    this.clock.onNewHour(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  tick(): Promise<number> {
    const time = this.clock.getLastHour().toNumber()

    return Promise.resolve(time)
  }
}
