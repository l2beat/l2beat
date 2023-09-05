import { RootIndexer } from '@l2beat/uif'

export class FakeClockIndexer extends RootIndexer {
  private height = 100

  override async start(): Promise<void> {
    await super.start()
    setInterval(() => this.requestTick(), 1_000)
  }

  override async tick(): Promise<number> {
    if (Math.random() < 0.05) {
      this.height = Math.max(this.height - 50, 0)
      this.logger.info('FakeClockIndexer: height decreased')
    } else {
      this.height += 10
    }
    return Promise.resolve(this.height)
  }
}
