import { RootIndexer } from '@l2beat/uif'

import { ONE_HOUR_MS } from './utils'

export class HourlyIndexer extends RootIndexer {
  async initialize(): Promise<number> {
    setInterval(() => this.requestTick(), 10 * 1000)
    return this.tick()
  }

  async tick(): Promise<number> {
    const now = new Date().getTime()
    const hours = Math.floor(now / ONE_HOUR_MS)
    return Promise.resolve(hours)
  }
}
