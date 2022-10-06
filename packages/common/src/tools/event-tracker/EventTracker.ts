import { UnixTime } from '@l2beat/types'

import { History, ReadonlyHistory } from './types'

const ONE_HOUR = 1000 * 60 * 60

export class EventTracker {
  private readonly history: History = new Map()

  constructor() {
    setInterval(() => this.pruneOldHistory(), ONE_HOUR)
  }

  record() {
    const now = UnixTime.now().toNumber()
    const count = this.history.get(now) ?? 0
    this.history.set(now, count + 1)
  }

  getHistory(): ReadonlyHistory {
    this.pruneOldHistory()
    return this.history
  }

  private pruneOldHistory() {
    const hourAgo = UnixTime.now().add(-1, 'hours')

    this.history.forEach((timestamp) => {
      if (new UnixTime(timestamp).lt(hourAgo)) {
        this.history.delete(timestamp)
      }
    })
  }
}
