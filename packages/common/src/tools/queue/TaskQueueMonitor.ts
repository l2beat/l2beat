import { json, UnixTime } from '@l2beat/types'

class Counters {
  constructor(public success = 0, public retry = 0, public error = 0) {}
}

const countersAverage = (timestampCounters: Counters[]) => {
  if (timestampCounters.length === 0) {
    return new Counters()
  }
  const sum = timestampCounters.reduce((acc, counter) => {
    return new Counters(
      acc.success + counter.success,
      acc.retry + counter.retry,
      acc.error + counter.error,
    )
  }, new Counters())
  return new Counters(
    sum.success / timestampCounters.length,
    sum.retry / timestampCounters.length,
    sum.error / timestampCounters.length,
  )
}

export class TaskQueueMonitor {
  private readonly timestampCounters = new Map<number, Counters>()

  constructor() {
    setInterval(() => this.handleNewSecond(), 1_000)
  }

  private handleNewSecond() {
    const now = UnixTime.now()
    if (!this.timestampCounters.has(+now)) {
      this.timestampCounters.set(+now, new Counters())
    }
    this.removeOldCounters(now)
  }

  private removeOldCounters(now: UnixTime) {
    Array.from(this.timestampCounters.keys())
      .filter((t) => now.add(-1, 'hours').gt(new UnixTime(t)))
      .forEach((t) => this.timestampCounters.delete(t))
  }

  record(when: UnixTime, type: 'success' | 'retry' | 'error') {
    const counters = this.timestampCounters.get(+when) ?? new Counters()
    counters[type] += 1
    this.timestampCounters.set(+when, counters)
  }

  getStats(): json {
    const now = UnixTime.now().add(-1, 'seconds')
    const lastSecond = this.timestampCounters.get(+now) ?? new Counters()
    const lastMinuteCounters = Array.from(this.timestampCounters.entries())
      .filter(([t]) => now.add(-1, 'minutes').lt(new UnixTime(t)))
      .map(([_t, counters]) => counters)
    const lastHourCounters = Array.from(this.timestampCounters.values())

    return {
      lastSecond: { ...lastSecond },
      lastMinuteAverage: { ...countersAverage(lastMinuteCounters) },
      lastHourAverage: { ...countersAverage(lastHourCounters) },
    }
  }
}
