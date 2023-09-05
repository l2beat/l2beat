import { RootIndexer } from '@l2beat/uif'

export class HourlyIndexer extends RootIndexer {
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
