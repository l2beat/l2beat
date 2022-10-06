import { UnixTime } from '@l2beat/types'

type TaskEvent = 'success' | 'retry' | 'error' | 'started'
export type Counter = Record<TaskEvent, number>

export class Monitor {
  private readonly counters = new Map<number, Counter>()

  constructor() {
    setInterval(() => this.removeOldCounters(), 1_000 * 60 * 60)
  }

  record(event: TaskEvent) {
    const now = UnixTime.now().toNumber()
    const counter = this.counters.get(now) ?? {
      success: 0,
      retry: 0,
      error: 0,
      started: 0,
    }
    counter[event] += 1
    this.counters.set(now, counter)
  }

  getStats() {
    this.removeOldCounters()
    const now = UnixTime.now()

    return {
      lastSecond: this.getLastSecondCounters(now),
      lastMinuteAverage: this.getCountersAverage(now, 'minutes'),
      lastHourAverage: this.getCountersAverage(now, 'hours'),
    }
  }

  private removeOldCounters() {
    const now = UnixTime.now()
    this.counters.forEach((_counter, timestamp) => {
      if (!now.add(-1, 'hours').gt(new UnixTime(timestamp))) {
        return
      }
      this.counters.delete(timestamp)
    })
  }

  private getLastSecondCounters(now: UnixTime): Counter {
    const lastTimestamp = now.add(-1, 'seconds').toNumber()
    const counter = this.counters.get(lastTimestamp)
    return {
      success: counter?.success ?? 0,
      retry: counter?.retry ?? 0,
      error: counter?.error ?? 0,
      started: counter?.started ?? 0,
    }
  }

  private getCountersAverage(
    now: UnixTime,
    duration: 'hours' | 'minutes',
  ): Counter {
    const average = { success: 0, retry: 0, error: 0, started: 0 }
    let total = 0

    this.counters.forEach((counter, timestamp) => {
      if (!now.add(-1, duration).lte(new UnixTime(timestamp))) {
        return
      }
      total++
      average.success += counter.success
      average.retry += counter.retry
      average.error += counter.error
      average.started += counter.started
    })

    average.success = average.success / total
    average.retry = average.retry / total
    average.error = average.error / total
    average.started = average.started / total

    return average
  }
}
