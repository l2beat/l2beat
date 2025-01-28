import { UnixTime } from '@l2beat/shared-pure'

import type { Clock } from '../../../tools/Clock'
import { alignTimestamp } from './alignTimestamp'
export class SyncOptimizer {
  private readonly gracePeriodDays = 3

  constructor(private readonly clock: Clock) {}

  get sixHourlyCutOffWithGracePeriod() {
    return this.clock
      .getLastHour()
      .add(-this.clock.sixHourlyCutoffDays - this.gracePeriodDays, 'days')
      .toEndOf('six hours')
  }

  get hourlyCutOffWithGracePeriod() {
    return this.clock
      .getLastHour()
      .add(-this.clock.hourlyCutoffDays - this.gracePeriodDays, 'days')
      .toEndOf('hour')
  }

  shouldTimestampBeSynced(timestamp: UnixTime) {
    return timestamp.equals(this.getTimestampToSync(timestamp.toNumber()))
  }

  getTimestampToSync(_timestamp: number): UnixTime {
    const timestamp = new UnixTime(_timestamp)

    const hourlyCutOff = this.hourlyCutOffWithGracePeriod
    const sixHourlyCutOff = this.sixHourlyCutOffWithGracePeriod

    return alignTimestamp(timestamp, hourlyCutOff, sixHourlyCutOff)
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
}
