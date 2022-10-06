import { json, UnixTime } from '@l2beat/types'

interface Counters {
  success: number
  retry: number
  error: number
}

export class TaskQueueMonitor {
  private readonly timestampCounters = new Map<number, Counters>()

  constructor() {
    setInterval(() => this.removeOldCounters(), 1_000 * 60 * 60)
  }

  record(type: 'success' | 'retry' | 'error') {
    const now = UnixTime.now().toNumber()
    const counters = this.timestampCounters.get(now) ?? {
      success: 0,
      retry: 0,
      error: 0,
    }
    counters[type] += 1
    this.timestampCounters.set(now, counters)
  }

  getStats(): json {
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
    this.timestampCounters.forEach((_counter, timestamp) => {
      if (!now.add(-1, 'hours').gt(new UnixTime(timestamp))) {
        return
      }
      this.timestampCounters.delete(timestamp)
    })
  }

  private getLastSecondCounters(now: UnixTime) {
    const lastTimestamp = now.add(-1, 'seconds').toNumber()
    return (
      this.timestampCounters.get(lastTimestamp) ?? {
        success: 0,
        retry: 0,
        error: 0,
      }
    )
  }

  private getCountersAverage(now: UnixTime, duration: 'hours' | 'minutes') {
    const average = { success: 0, retry: 0, error: 0 }
    let total = 0
    this.timestampCounters.forEach((counter, timestamp) => {
      if (!now.add(-1, duration).lte(new UnixTime(timestamp))) {
        return
      }
      total++
      average.success += counter.success
      average.retry += counter.retry
      average.error += counter.error
    })
    average.success = average.success / total
    average.retry = average.retry / total
    average.error = average.error / total
    return average
  }
}
