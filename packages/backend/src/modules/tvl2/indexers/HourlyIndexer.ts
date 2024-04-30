import { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'

import { Clock } from '../../../tools/Clock'

export interface HourlyIndexerDeps {
  logger: Logger
  clock: Clock
}

export class HourlyIndexer extends RootIndexer {
  constructor(readonly $: HourlyIndexerDeps) {
    super($.logger)
  }

  override async initialize(): Promise<number> {
    this.$.clock.onNewHour(() => this.requestTick())
    return this.tick()
  }

  tick(): Promise<number> {
    const time = this.$.clock.getLastHour().toHours()
    return Promise.resolve(time)
  }
}
