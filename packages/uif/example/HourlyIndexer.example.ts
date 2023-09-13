import { RootIndexer } from '../src/BaseIndexer'

const MS_IN_HOUR = 60 * 60 * 1000

export class HourlyIndexer extends RootIndexer {
  override async start() {
    await super.start()
    setInterval(() => this.tick(), MS_IN_HOUR)
  }

  tick(): Promise<number> {
    const time = getLastFullHourTimestampSeconds()
    return Promise.resolve(time)
  }
}

function getLastFullHourTimestampSeconds() {
  const now = Date.now()
  const lastFullHour = now - (now % MS_IN_HOUR)
  return Math.floor(lastFullHour / 1000)
}
