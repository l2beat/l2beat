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
    return timestamp.equals(this.getTimestampToSync(timestamp.toNumber()))
  }

  getTimestampToSync(_timestamp: number): UnixTime {
    const timestamp = new UnixTime(_timestamp)
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

  getTimestampsToSync(from: number, to: number, maxTimestamps: number) {
    const timestamps: UnixTime[] = []

    let current = this.getTimestampToSync(from)
    const last = new UnixTime(to)

    while (current.lte(last) && timestamps.length < maxTimestamps) {
      timestamps.push(current)
      current = this.getTimestampToSync(current.toNumber() + 1)
    }

    return timestamps
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
