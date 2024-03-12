import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../tools/Clock'

interface SyncServiceOptions {
  minTimestamp: UnixTime
  removeHourlyAfterDays: number
  removeSixHourlyAfterDays: number
}

export class SyncService {
  constructor(
    private readonly clock: Clock,
    private readonly options: SyncServiceOptions,
  ) {}

  getTimestampToSync(timestamp: UnixTime): UnixTime {
    if (timestamp.lt(this.options.minTimestamp)) {
      return this.getTimestampToSync(this.options.minTimestamp)
    }

    const lastHour = this.clock.getLastHour()

    const hourlyCutOff = lastHour.add(
      -this.options.removeHourlyAfterDays,
      'days',
    )
    if (timestamp.gte(hourlyCutOff)) {
      return timestamp.toEndOf('hour')
    }

    const sixHourlyCutOff = lastHour.add(
      -this.options.removeSixHourlyAfterDays,
      'days',
    )
    if (timestamp.gte(sixHourlyCutOff)) {
      return timestamp.toEndOf('six hours')
    }

    return timestamp.toEndOf('day')
  }
}
