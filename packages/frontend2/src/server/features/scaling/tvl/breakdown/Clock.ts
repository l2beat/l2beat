import { UnixTime } from '@l2beat/shared-pure'
import { alignTimestamp } from './alignTimestamp'

export class Clock {
  constructor(
    private readonly minTimestamp: UnixTime,
    private readonly delayInSeconds: number,
    readonly hourlyCutoffDays = 7,
    readonly sixHourlyCutoffDays = 90,
  ) {}

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
}
