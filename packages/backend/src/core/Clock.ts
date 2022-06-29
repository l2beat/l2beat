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
}
