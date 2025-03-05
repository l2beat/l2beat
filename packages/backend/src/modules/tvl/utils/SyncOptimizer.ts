import { UnixTime } from '@l2beat/shared-pure'

import type { Clock } from '../../../tools/Clock'
import { alignTimestamp } from './alignTimestamp'
export class SyncOptimizer {
  private readonly gracePeriodDays = 3

  constructor(private readonly clock: Clock) {}

  get sixHourlyCutOffWithGracePeriod() {
    return UnixTime.toEndOf(
      this.clock.getLastHour() +
        UnixTime(
          -this.clock.sixHourlyCutoffDays - this.gracePeriodDays,
          'days',
        ),
      'six hours',
    )
  }

  get hourlyCutOffWithGracePeriod() {
    return UnixTime.toEndOf(
      this.clock.getLastHour() +
        UnixTime(-this.clock.hourlyCutoffDays - this.gracePeriodDays, 'days'),
      'hour',
    )
  }

  shouldTimestampBeSynced(timestamp: UnixTime) {
    return timestamp === this.getTimestampToSync(timestamp)
  }

  getTimestampToSync(_timestamp: number): UnixTime {
    const timestamp = UnixTime(_timestamp)

    const hourlyCutOff = this.hourlyCutOffWithGracePeriod
    const sixHourlyCutOff = this.sixHourlyCutOffWithGracePeriod

    return alignTimestamp(timestamp, hourlyCutOff, sixHourlyCutOff)
  }

  getTimestampsToSync(from: number, to: number, maxTimestamps: number) {
    const timestamps: UnixTime[] = []

    let current = this.getTimestampToSync(from)
    const last = UnixTime(to)

    while (current <= last && timestamps.length < maxTimestamps) {
      timestamps.push(current)
      current = this.getTimestampToSync(current + 1)
    }

    return timestamps
  }
}
