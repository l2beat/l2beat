import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../../tools/Clock'

interface SyncOptimizerOptions {
  removeHourlyAfterDays: number
  removeSixHourlyAfterDays: number
}

export class SyncOptimizer {
  constructor(
    private readonly clock: Clock,
    private readonly options: SyncOptimizerOptions,
  ) {}

  shouldTimestampBeSynced(timestamp: UnixTime) {
    return timestamp.equals(this.getTimestampToSync(timestamp))
  }

  getTimestampToSync(timestamp: UnixTime): UnixTime {
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
