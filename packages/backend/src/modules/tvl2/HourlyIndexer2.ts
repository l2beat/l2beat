import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/discovery'
import { RootIndexer } from '@l2beat/uif'

export class HourlyIndexer2 extends RootIndexer {
  constructor(logger: Logger, private readonly offsetHours: number) {
    super(logger)
  }

  override initialize(): Promise<number> {
    setInterval(() => this.requestTick(), 1000)
    return Promise.resolve(this.tick())
  }

  override tick(): Promise<number> {
    const now = Date.now()
    const currentHour = Math.floor(now / UnixTime.HOUR)
    return Promise.resolve(currentHour - this.offsetHours)
  }
}
