import { UnixTime } from '@l2beat/shared-pure'
import { alignTimestamp } from '../modules/tvl/utils/alignTimestamp'

export class Clock {
  constructor(
    private readonly minTimestamp: UnixTime,
    private readonly delayInSeconds: number,
    readonly hourlyCutoffDays = 7,
    readonly sixHourlyCutoffDays = 90,
    private readonly refreshIntervalMs = 1000,
  ) {}

  getFirstHour(): UnixTime {
    const result = this.minTimestamp.toEndOf('hour')
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

  shouldTimestampBeIncluded(targetTimestamp: UnixTime, timestamp: UnixTime) {
    return timestamp.equals(
      this.getTimestampForApi(targetTimestamp, timestamp.toNumber()),
    )
  }

  getAllTimestampsForApi(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride: UnixTime
    },
  ): UnixTime[] {
    const from = options?.minTimestampOverride.gt(this.getFirstDay())
      ? this.getTimestampForApi(
          targetTimestamp,
          options.minTimestampOverride.toNumber(),
        )
      : this.getFirstDay()

    let current = this.getTimestampForApi(targetTimestamp, from.toNumber())

    const timestamps: UnixTime[] = []
    while (current.lte(targetTimestamp)) {
      timestamps.push(current)
      current = this.getTimestampForApi(targetTimestamp, current.toNumber() + 1)
    }

    return timestamps
  }

  private getTimestampForApi(
    targetTimestamp: UnixTime,
    _timestamp: number,
  ): UnixTime {
    const timestamp = new UnixTime(_timestamp)
    const hourlyCutOff = this.getHourlyCutoff(targetTimestamp)
    const sixHourlyCutOff = this.getSixHourlyCutoff(targetTimestamp)

    return alignTimestamp(timestamp, hourlyCutOff, sixHourlyCutOff)
  }

  getSixHourlyCutoff(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride: UnixTime
    },
  ): UnixTime {
    const cutoff = targetTimestamp
      .add(-this.sixHourlyCutoffDays, 'days')
      .toEndOf('six hours')

    return options?.minTimestampOverride.gt(cutoff)
      ? options.minTimestampOverride.toEndOf('six hours')
      : cutoff
  }

  getHourlyCutoff(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride: UnixTime
    },
  ): UnixTime {
    const cutoff = targetTimestamp
      .add(-this.hourlyCutoffDays, 'days')
      .toEndOf('hour')

    return options?.minTimestampOverride.gt(cutoff)
      ? options.minTimestampOverride.toEndOf('hour')
      : cutoff
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
