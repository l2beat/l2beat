import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../../tools/Clock'
export class SyncOptimizer {
  private readonly sixHourlyCutoffDays = 90
  private readonly hourlyCutoffDays = 7
  // it is only used for fetching data and tvlCleaner, not for API
  private readonly gracePeriodDays = 3

  constructor(private readonly clock: Clock) {}

  get sixHourlyCutOff() {
    return this.clock.getLastHour().add(-this.sixHourlyCutoffDays, 'days')
  }

  get sixHourlyCutOffWithGracePeriod() {
    return this.clock
      .getLastHour()
      .add(-this.sixHourlyCutoffDays - this.gracePeriodDays, 'days')
  }

  get hourlyCutOff() {
    return this.clock.getLastHour().add(-this.hourlyCutoffDays, 'days')
  }

  get hourlyCutOffWithGracePeriod() {
    return this.clock
      .getLastHour()
      .add(-this.hourlyCutoffDays - this.gracePeriodDays, 'days')
  }

  shouldTimestampBeSynced(timestamp: UnixTime) {
    return timestamp.equals(this.getTimestampToSync(timestamp.toNumber()))
  }

  getTimestampToSync(_timestamp: number): UnixTime {
    const timestamp = new UnixTime(_timestamp)

    const hourlyCutOff = this.hourlyCutOffWithGracePeriod
    if (timestamp.gte(hourlyCutOff)) {
      return timestamp.toEndOf('hour')
    }

    const sixHourlyCutOff = this.sixHourlyCutOffWithGracePeriod
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

  getAllTimestampsToSync() {
    return this.getTimestampsToSync(
      this.clock.getFirstDay().toNumber(),
      this.clock.getLastHour().toNumber(),
      Infinity,
    )
  }
}
