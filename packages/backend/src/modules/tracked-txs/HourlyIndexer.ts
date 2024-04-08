import { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'

import { Clock } from '../../tools/Clock'

export class HourlyIndexer extends RootIndexer {
  constructor(logger: Logger, private readonly clock: Clock) {
    super(logger)
  }

  override async initialize(): Promise<number> {
    this.logger.info('Starting...')

    this.clock.onNewHour(() => this.requestTick())
    return this.tick()
  }

  tick(): Promise<number> {
    const time = this.clock.getLastHour().toNumber()
    return Promise.resolve(time)
  }
}
