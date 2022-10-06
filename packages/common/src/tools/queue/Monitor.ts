import { UnixTime } from '@l2beat/types'

type Counts = Record<TaskEvent, number>

type TaskEvent = 'success' | 'retry' | 'error' | 'started'

type Counter = Map<number, number>

const ONE_HOUR = 1000 * 60 * 60

export class Monitor {
  private readonly counters: Record<TaskEvent, Counter> = {
    success: new Map(),
    retry: new Map(),
    error: new Map(),
    started: new Map(),
  }

  constructor() {
    setInterval(() => this.pruneOldCounts(), ONE_HOUR)
  }

  record(event: TaskEvent) {
    const now = UnixTime.now().toNumber()
    const count = this.counters[event].get(now) ?? 0
    this.counters[event].set(now, count + 1)
  }

  getStats() {
    this.pruneOldCounts()
    const now = UnixTime.now()

    return {
      lastSecond: this.getLastSecondCounts(now),
      lastMinuteAverage: this.getAverageCounts(now, 'minutes'),
      lastHourAverage: this.getAverageCounts(now, 'hours'),
    }
  }

  private pruneOldCounts() {
    const earliest = UnixTime.now().add(-1, 'hours')

    Object.values(this.counters).forEach((counter) => {
      counter.forEach((timestamp) => {
        if (new UnixTime(timestamp).lt(earliest)) {
          counter.delete(timestamp)
        }
      })
    })
  }

  private getLastSecondCounts(now: UnixTime): Counts {
    const lastSecond = now.add(-1, 'seconds').toNumber()
    return {
      error: this.counters.error.get(lastSecond) ?? 0,
      success: this.counters.success.get(lastSecond) ?? 0,
      retry: this.counters.retry.get(lastSecond) ?? 0,
      started: this.counters.started.get(lastSecond) ?? 0,
    }
  }

  private getAverageCounts(
    now: UnixTime,
    duration: 'hours' | 'minutes',
  ): Counts {
    const from = now.add(-1, duration)
    return {
      error: this.getDurationAverage(from, now, this.counters.error),
      success: this.getDurationAverage(from, now, this.counters.success),
      retry: this.getDurationAverage(from, now, this.counters.retry),
      started: this.getDurationAverage(from, now, this.counters.started),
    }
  }

  private getDurationAverage(
    from: UnixTime,
    to: UnixTime,
    counter: Counter,
  ): number {
    let sum = 0

    counter.forEach((count, timestamp) => {
      const when = new UnixTime(timestamp)
      if (when.gte(from) && when.lt(to)) {
        sum += count
      }
    })

    const total = to.toNumber() - from.toNumber()
    return total === 0 ? 0 : sum / total
  }
}
