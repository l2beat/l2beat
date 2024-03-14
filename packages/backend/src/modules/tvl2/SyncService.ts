import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../tools/Clock'

interface SyncServiceOptions {
  chainsMinTimestamp: Record<string, UnixTime>
  removeHourlyAfterDays: number
  removeSixHourlyAfterDays: number
}

export class SyncService {
  constructor(
    private readonly clock: Clock,
    private readonly options: SyncServiceOptions,
  ) {}

  shouldTimestampBeSynced(chain: string, timestamp: UnixTime) {
    return timestamp.equals(this.getTimestampToSync(chain, timestamp, 'to'))
  }

  getTimestampToSync(
    chain: string,
    timestamp: UnixTime,
    boundaryType: 'from' | 'to',
  ): UnixTime {
    const minTimestamp = this.options.chainsMinTimestamp[chain]
    assert(minTimestamp, 'Unknown chain: ' + chain)

    if (timestamp.lt(minTimestamp)) {
      timestamp = minTimestamp
    }

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
