import { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'

import { Clock } from '../Clock'

export class HourlyIndexer extends RootIndexer {
  constructor(logger: Logger, private readonly clock: Clock) {
    super(logger)
  }

  override async start(): Promise<void> {
    await super.start()

    this.requestTick()

    this.clock.onNewHour(() => this.requestTick())
  }

  tick(): Promise<number> {
    const time = this.clock.getLastHour().toNumber()
    return Promise.resolve(time)
  }
}
