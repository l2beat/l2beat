import { RootIndexer } from '@l2beat/uif'
import { Logger } from '@l2beat/backend-tools'

export class FakeClockIndexer extends RootIndexer {
  private height = 100

  constructor(logger: Logger) {
    super(logger)
  }

  override async start(): Promise<void> {
    await super.start()
    setInterval(() => this.scheduleTick(), 1000)
  }

  override async tick(): Promise<number> {
    if (Math.random() < 0.1) {
      this.height -= 100
      this.logger.info('FakeClockIndexer: height decreased')
    } else {
      this.height += 10
    }
    return this.height
  }
}
