import { UnixTime } from '@l2beat/types'

import { History, ReadonlyHistory } from './types'

export class EventTracker {
  private readonly history: History = new Map()

  constructor(private readonly historySizeInSeconds = UnixTime.HOUR) {
    setInterval(() => this.pruneOldHistory(), this.historySizeInSeconds * 1000)
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
    const beginning = UnixTime.now().add(
      -1 * this.historySizeInSeconds,
      'seconds',
    )

    this.history.forEach((_count, timestamp) => {
      if (new UnixTime(timestamp).lt(beginning)) {
        this.history.delete(timestamp)
      }
    })
  }
}
