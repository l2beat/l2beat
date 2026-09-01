import { UnixTime } from '@l2beat/shared-pure'

export class Clock {
  constructor(
    private readonly minTimestamp: UnixTime,
    private readonly delayInSeconds: number,
    private readonly refreshIntervalMs = 1000,
  ) {}

  getFirstHour(): UnixTime {
    const result = UnixTime.toEndOf(this.minTimestamp, 'hour')
    if (result > this.getLastHour()) {
      throw new Error('minTimestamp must be in the past')
    }
    return result
  }

  getFirstDay(): UnixTime {
    let result = this.minTimestamp

    if (!UnixTime.isFull(result, 'day')) {
      result = UnixTime.toNext(result, 'day')
    }
    if (result > this.getLastDay()) {
      throw new Error('minTimestamp must be in the past')
    }

    return result
  }

  getLastHour(): UnixTime {
    return UnixTime.toStartOf(UnixTime.now() - this.delayInSeconds, 'hour')
  }

  getLastDay(): UnixTime {
    return UnixTime.toStartOf(UnixTime.now() - this.delayInSeconds, 'day')
  }

  onNewHour(callback: (timestamp: UnixTime) => void) {
    let current = this.getLastHour()
    const onNewTimestamps = () => {
      const last = this.getLastHour()
      while (current < last) {
        current = current + 1 * UnixTime.HOUR
        callback(current)
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
      while (current < last) {
        current = current + 1 * UnixTime.DAY
        callback(current)
      }
    }

    onNewTimestamps()
    const interval = setInterval(onNewTimestamps, this.refreshIntervalMs)
    return () => clearInterval(interval)
  }
}
