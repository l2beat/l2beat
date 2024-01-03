import { UnixTime } from '@l2beat/shared-pure'

export class Clock {
  constructor(
    private readonly minTimestamp: UnixTime,
    private readonly delayInSeconds: number,
    private readonly refreshIntervalMs = 1000,
  ) {}

  getFirstHour(): UnixTime {
    let result = this.minTimestamp

    if (!result.isFull('hour')) {
      result = result.toNext('hour')
    }
    if (result.gt(this.getLastHour())) {
      throw new Error('minTimestamp must be in the past')
    }

    return result
  }

  getFirstDay(): UnixTime {
    let result = this.minTimestamp

    if (!result.isFull('day')) {
      result = result.toNext('day')
    }
    if (result.gt(this.getLastDay())) {
      throw new Error('minTimestamp must be in the past')
    }

    return result
  }

  getLastHour(): UnixTime {
    return UnixTime.now().add(-this.delayInSeconds, 'seconds').toStartOf('hour')
  }

  getLastDay(): UnixTime {
    return UnixTime.now().add(-this.delayInSeconds, 'seconds').toStartOf('day')
  }

  onEveryHour(callback: (timestamp: UnixTime) => void) {
    let next = this.getFirstHour()
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

  onEveryDay(callback: (timestamp: UnixTime) => void) {
    let next = this.getFirstDay()
    const onNewTimestamps = () => {
      const last = this.getLastDay()
      while (next.lte(last)) {
        callback(next)
        next = next.add(1, 'days')
      }
    }

    onNewTimestamps()
    const interval = setInterval(onNewTimestamps, this.refreshIntervalMs)
    return () => clearInterval(interval)
  }

  onNewDay(callback: (timestamp: UnixTime) => void) {
    let current = this.getLastDay()
    const onNewTimestamps = () => {
      const last = this.getLastDay()
      while (current.lt(last)) {
        current = current.add(1, 'days')
        callback(current)
      }
    }

    onNewTimestamps()
    const interval = setInterval(onNewTimestamps, this.refreshIntervalMs)
    return () => clearInterval(interval)
  }
}
