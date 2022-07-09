import { UnixTime } from '@l2beat/common'

export class Clock {
  constructor(
    private minTimestamp: UnixTime,
    private delayInSeconds: number,
    private refreshIntervalMs = 1000,
  ) {
    if (!this.minTimestamp.isFull('hour')) {
      this.minTimestamp = this.minTimestamp.toNext('hour')
    }
    if (this.minTimestamp.gt(this.getLastHour())) {
      throw new Error('minTimestamp must be in the past')
    }
  }

  getFirstHour() {
    return this.minTimestamp
  }

  getLastHour() {
    return UnixTime.now().add(-this.delayInSeconds, 'seconds').toStartOf('hour')
  }

  onEveryHour(callback: (timestamp: UnixTime) => void) {
    let next = this.minTimestamp
    const onNewTimestamps = () => {
      const last = this.getLastHour()
      while (next.lte(last)) {
        callback(next)
        next = next.add(1, 'hours')
      }
    }

    onNewTimestamps()
    const interval = setInterval(onNewTimestamps, this.refreshIntervalMs)
    return () => clearInterval(interval)
  }

  onNewHour(callback: (timestamp: UnixTime) => void) {
    let current = this.getLastHour()
    const onNewTimestamps = () => {
      const last = this.getLastHour()
      while (current.lt(last)) {
        current = current.add(1, 'hours')
        callback(current)
      }
    }

    onNewTimestamps()
    const interval = setInterval(onNewTimestamps, this.refreshIntervalMs)
    return () => clearInterval(interval)
  }
}
