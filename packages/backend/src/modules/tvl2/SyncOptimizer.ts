import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../tools/Clock'

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
    return timestamp.equals(this.getTimestampToSync(timestamp, 'to'))
  }

  getTimestampToSync(
    timestamp: UnixTime,
    boundaryType: 'from' | 'to',
  ): UnixTime {
    const lastHour = this.clock.getLastHour()

    const hourlyCutOff = lastHour.add(
      -this.options.removeHourlyAfterDays,
      'days',
    )
    if (timestamp.gte(hourlyCutOff)) {
      return boundaryType === 'from'
        ? timestamp.toEndOf('hour')
        : timestamp.toStartOf('hour')
    }

    const sixHourlyCutOff = lastHour.add(
      -this.options.removeSixHourlyAfterDays,
      'days',
    )
    if (timestamp.gte(sixHourlyCutOff)) {
      return boundaryType === 'from'
        ? timestamp.toEndOf('six hours')
        : timestamp.toStartOf('six hours')
    }

    return boundaryType === 'from'
      ? timestamp.toEndOf('day')
      : timestamp.toStartOf('day')
  }
}
