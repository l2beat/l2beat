import { UnixTime } from '@l2beat/shared-pure'

export class Clock {
  constructor(
    private readonly minTimestamp: UnixTime,
    private readonly delayInSeconds: number,
    private readonly refreshIntervalMs = 1000,
  ) {
    if (!this.minTimestamp.isFull('hour')) {
      this.minTimestamp = this.minTimestamp.toNext('hour')
    }
    if (this.minTimestamp.gt(this.getLastHour())) {
      throw new Error('minTimestamp must be in the past')
    }
  }

  getFirstHour(): UnixTime {
    return this.minTimestamp
  }

  getLastHour(): UnixTime {
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
