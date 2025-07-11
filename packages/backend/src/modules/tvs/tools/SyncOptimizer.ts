import { UnixTime } from '@l2beat/shared-pure'
import { alignTimestamp } from '../../../tools/alignTimestamp'
import type { Clock } from '../../../tools/Clock'
export class SyncOptimizer {
  private readonly gracePeriodDays = 3

  constructor(private readonly clock: Clock) {}

  get sixHourlyCutOffWithGracePeriod() {
    return UnixTime.toEndOf(
      this.clock.getLastHour() +
        (-this.clock.sixHourlyCutoffDays - this.gracePeriodDays) * UnixTime.DAY,
      'six hours',
    )
  }

  get hourlyCutOffWithGracePeriod() {
    return UnixTime.toEndOf(
      this.clock.getLastHour() +
        (-this.clock.hourlyCutoffDays - this.gracePeriodDays) * UnixTime.DAY,
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
