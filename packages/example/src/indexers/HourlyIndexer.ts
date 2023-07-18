import { RootIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

export class HourlyIndexer extends RootIndexer {
  constructor(logger: Logger) {
    super(logger)
  }

  override async start(): Promise<void> {
    await super.start()
    setInterval(() => this.requestTick(), 60 * 1000)
  }

  async tick(): Promise<number> {
    const hourInMs = 60 * 60 * 1000
    const time = (new Date().getTime() % hourInMs) * hourInMs
    return Promise.resolve(time)
  }
}
