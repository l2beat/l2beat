import { UnixTime } from '@l2beat/shared-pure'

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

  getSixHourlyCutoff(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride?: UnixTime
    },
  ): UnixTime {
    const result = targetTimestamp
      .add(-this.sixHourlyCutoffDays, 'days')
      .toEndOf('six hours')

    if (options && options.minTimestampOverride) {
      if (options.minTimestampOverride.gt(result)) {
        return options.minTimestampOverride.toEndOf('six hours')
      }
    }

    return result
  }

  getHourlyCutoff(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride?: UnixTime
    },
  ): UnixTime {
    const result = targetTimestamp
      .add(-this.hourlyCutoffDays, 'days')
      .toEndOf('hour')

    if (options && options.minTimestampOverride) {
      if (options.minTimestampOverride.gt(result)) {
        return options.minTimestampOverride.toEndOf('hour')
      }
    }

    return result
  }

  getAllTimestampsForApi(
    targetTimestamp: UnixTime,
    options?: {
      minTimestampOverride?: UnixTime
    },
  ): UnixTime[] {
    const timestamps: UnixTime[] = []

    const minTimestampOverride =
      options && options.minTimestampOverride
        ? UnixTime.max(
            options.minTimestampOverride.toEndOf('day'),
            this.getFirstDay(),
          )
        : undefined

    const from = minTimestampOverride ?? this.getFirstDay()

    let current = this._getTimestampForApi(targetTimestamp, from.toNumber())
    const last = targetTimestamp

    while (current.lte(last)) {
      timestamps.push(current)
      current = this._getTimestampForApi(
        targetTimestamp,
        current.toNumber() + 1,
      )
    }

    return timestamps
  }

  _getTimestampForApi(targetTimestamp: UnixTime, _timestamp: number): UnixTime {
    const timestamp = new UnixTime(_timestamp)

    const hourlyCutOff = this.getHourlyCutoff(targetTimestamp)
    const sixHourlyCutOff = this.getSixHourlyCutoff(targetTimestamp)

    if (timestamp.gte(hourlyCutOff)) {
      return timestamp.toEndOf('hour')
    }

    if (timestamp.gte(sixHourlyCutOff)) {
      const result = timestamp.toEndOf('six hours')
      return result.lte(hourlyCutOff) ? result : hourlyCutOff
    }

    const result = timestamp.toEndOf('day')
    return result.lte(sixHourlyCutOff) ? result : sixHourlyCutOff
  }

  shouldTimestampBeIncluded(targetTimestamp: UnixTime, timestamp: UnixTime) {
    return timestamp.equals(
      this._getTimestampForApi(targetTimestamp, timestamp.toNumber()),
    )
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
