import { UnixTime } from '@l2beat/shared-pure'

import { assert } from 'console'
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
    return timestamp.equals(this.getOptimizedTimestamp(timestamp))
  }

  getTimestampToSync(from: number, to: number): UnixTime {
    const timestamp = this.getOptimizedTimestamp(new UnixTime(from))
    // It relies on an assumption that all indexers use SyncOptimizer
    // If this assert starts throwing either update logic of fix configuration
    assert(timestamp.lte(new UnixTime(to)), 'Invalid range')

    return timestamp
  }

  getOptimizedTimestamp(timestamp: UnixTime): UnixTime {
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

  get sixHourlyCutOff() {
    return this.clock
      .getLastHour()
      .add(-this.options.removeSixHourlyAfterDays, 'days')
  }

  get hourlyCutOff() {
    return this.clock
      .getLastHour()
      .add(-this.options.removeHourlyAfterDays, 'days')
  }
}
