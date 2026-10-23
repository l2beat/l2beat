import type { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'

import type { Clock } from './Clock'

export class DailyIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
  ) {
    super(logger)
  }

  override async initialize() {
    this.clock.onNewDay(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  tick(): Promise<number> {
    return Promise.resolve(this.clock.getLastDay())
  }
}
