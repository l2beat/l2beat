import { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'
import { Gauge } from 'prom-client'

import { Clock } from '../../../tools/Clock'

export class HourlyIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly module?: string,
  ) {
    super(logger)
  }

  override async initialize() {
    this.logger.info('Starting...')

    this.clock.onNewHour(() => this.requestTick())
    return { safeHeight: await this.tick() }
  }

  tick(): Promise<number> {
    const time = this.clock.getLastHour().toNumber()
    targetTimestamp.labels({ module: this.module ?? 'undefined' }).set(time)

    return Promise.resolve(time)
  }
}

const targetTimestamp = new Gauge({
  name: 'target_timestamp',
  help: 'Value showing the target timestamp of the system',
  labelNames: ['module'],
})
