import { UnixTime } from '@l2beat/shared-pure'

const SAFETY_OFFSET = 3
const REMOVE_HOURLY_AFTER_DAYS = 7 + SAFETY_OFFSET
const REMOVE_SIX_HOURLY_AFTER_DAYS = 90 + SAFETY_OFFSET
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

  /**
   * WARNING: this method should be used only in TVL module
   */
  _TVL_ONLY_onEveryHour(callback: (timestamp: UnixTime) => void) {
    let next = this.getFirstHour()
    const onNewTimestamps = () => {
      const last = this.getLastHour()
      while (next.lte(last)) {
        if (next.add(REMOVE_HOURLY_AFTER_DAYS, 'days').gte(last)) {
          callback(next)
        } else if (next.add(REMOVE_SIX_HOURLY_AFTER_DAYS, 'days').gte(last)) {
          if (next.isFull('six hours')) {
            callback(next)
          }
        } else {
          if (next.isFull('day')) {
            callback(next)
          }
        }
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

  _TVL_ONLY_getHourlyDeletionBoundary(): UnixTime {
    return this.getLastHour().add(-REMOVE_HOURLY_AFTER_DAYS, 'days')
  }

  _TVL_ONLY_getSixHourlyDeletionBoundary(): UnixTime {
    return this.getLastHour().add(-REMOVE_SIX_HOURLY_AFTER_DAYS, 'days')
  }
}
