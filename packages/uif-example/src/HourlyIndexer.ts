import { RootIndexer } from '@l2beat/uif'

import { ONE_HOUR_MS } from './utils'

export class HourlyIndexer extends RootIndexer {
  async initialize() {
    setInterval(() => this.requestTick(), 10 * 1000)
    return { safeHeight: await this.tick() }
  }

  async tick(): Promise<number> {
    const now = new Date().getTime()
    const hours = Math.floor(now / ONE_HOUR_MS)
    return await Promise.resolve(hours)
  }
}
