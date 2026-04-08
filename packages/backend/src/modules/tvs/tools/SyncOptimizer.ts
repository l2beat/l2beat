import { UnixTime } from '@l2beat/shared-pure'
import { alignTimestamp } from '../../../tools/alignTimestamp'
import type { Clock } from '../../../tools/Clock'

// Frontend shows hourly data for max range of 7 days but we use 14 days to be safe
const HOURLY_CUTOFF_DAYS = 14
// Frontend shows six hourly data for max range of 90 days but we use 100 days to be safe
const SIX_HOURLY_CUTOFF_DAYS = 100

export class SyncOptimizer {
  constructor(private readonly clock: Clock) {}

  shouldTimestampBeSynced(timestamp: UnixTime) {
    return timestamp === this.getTimestampToSync(timestamp)
  }

  getTimestampToSync(_timestamp: number): UnixTime {
    const timestamp = UnixTime(_timestamp)

    const hourlyCutOff = this.getHourlyCutOffWithGracePeriod()
    const sixHourlyCutOff = this.getSixHourlyCutOffWithGracePeriod()

    return alignTimestamp(timestamp, hourlyCutOff, sixHourlyCutOff)
  }

  getSixHourlyCutOffWithGracePeriod(targetTimestamp?: UnixTime) {
    const timestamp = targetTimestamp ?? this.clock.getLastHour()
    return UnixTime.toEndOf(
      timestamp - SIX_HOURLY_CUTOFF_DAYS * UnixTime.DAY,
      'six hours',
    )
  }

  getHourlyCutOffWithGracePeriod(targetTimestamp?: UnixTime) {
    const timestamp = targetTimestamp ?? this.clock.getLastHour()
    return UnixTime.toEndOf(
      timestamp - HOURLY_CUTOFF_DAYS * UnixTime.DAY,
      'hour',
    )
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
