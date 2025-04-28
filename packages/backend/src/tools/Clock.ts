import { UnixTime } from '@l2beat/shared-pure'
import { alignTimestamp } from './alignTimestamp'

export class Clock {
  constructor(
    private readonly minTimestamp: UnixTime,
    private readonly delayInSeconds: number,
    readonly hourlyCutoffDays = 7,
    readonly sixHourlyCutoffDays = 90,
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

  shouldTimestampBeIncluded(targetTimestamp: UnixTime, timestamp: UnixTime) {
    return timestamp === this.getTimestampForApi(targetTimestamp, timestamp)
  }

  getAllTimestampsForApi(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride: UnixTime
    },
  ): UnixTime[] {
    const from =
      options?.minTimestampOverride &&
      options.minTimestampOverride > this.getFirstDay()
        ? this.getTimestampForApi(targetTimestamp, options.minTimestampOverride)
        : this.getFirstDay()

    let current = this.getTimestampForApi(targetTimestamp, from)

    const timestamps: UnixTime[] = []
    while (current <= targetTimestamp) {
      timestamps.push(current)
      current = this.getTimestampForApi(targetTimestamp, current + 1)
    }

    return timestamps
  }

  private getTimestampForApi(
    targetTimestamp: UnixTime,
    _timestamp: number,
  ): UnixTime {
    const timestamp = UnixTime(_timestamp)
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
    const cutoff = UnixTime.toEndOf(
      targetTimestamp - this.sixHourlyCutoffDays * UnixTime.DAY,
      'six hours',
    )

    return options?.minTimestampOverride &&
      options.minTimestampOverride > cutoff
      ? UnixTime.toEndOf(options.minTimestampOverride, 'six hours')
      : cutoff
  }

  getHourlyCutoff(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride: UnixTime
    },
  ): UnixTime {
    const cutoff = UnixTime.toEndOf(
      targetTimestamp - this.hourlyCutoffDays * UnixTime.DAY,
      'hour',
    )

    return options?.minTimestampOverride &&
      options.minTimestampOverride > cutoff
      ? UnixTime.toEndOf(options.minTimestampOverride, 'hour')
      : cutoff
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
