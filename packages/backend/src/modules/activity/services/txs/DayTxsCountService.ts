import type { HourlyActivityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type {
  DayProvider,
  HourlyCount,
} from '../../../../providers/day/DayProviders'
import type { DayActivityRecord } from '../../indexers/types'
import { getDayHourPeak } from '../../utils/peaks'

interface Dependencies {
  provider: DayProvider
  projectId: ProjectId
}

export class DayTxsCountService {
  constructor(private readonly $: Dependencies) {}

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<{
    records: DayActivityRecord[]
    hours?: HourlyActivityRecord[]
    latestTimestamp: number
  }> {
    const { provider } = this.$
    let dailyTxs: Record<number, number>
    let dailyUops: Record<number, number>
    let hours: HourlyActivityRecord[] | undefined
    if ('getHourlyCounts' in provider) {
      // Days and hours from one response, so a day always equals its hours
      const counts = await provider.getHourlyCounts(from, to)
      dailyTxs = sumPerDay(counts, 'count')
      dailyUops = sumPerDay(counts, 'uopsCount')
      hours = counts.map((hour) => ({ projectId: this.$.projectId, ...hour }))
    } else {
      dailyTxs = await provider.getDailyTxsCount(from, to)
      dailyUops = await provider.getDailyUopsCount(from, to)
    }

    const latestTimestamp = Math.max(
      ...Object.keys(dailyTxs).map(Number),
      ...Object.keys(dailyUops).map(Number),
    )
    assert(latestTimestamp, 'Latest timestamp is undefined')

    const records: DayActivityRecord[] = range(from, to).map((day) => {
      const timestamp = day * UnixTime.DAY
      const count = dailyTxs[timestamp]
      assert(count !== undefined, 'Count is undefined')
      return {
        projectId: this.$.projectId,
        timestamp: timestamp,
        count,
        uopsCount: dailyUops[timestamp] ?? null,
        start: timestamp,
        end: timestamp + 1 * UnixTime.DAY - 1,
        ...(hours && getDayHourPeak(timestamp, hours)),
      }
    })

    return {
      records,
      ...(hours && { hours }),
      latestTimestamp,
    }
  }
}

function sumPerDay(
  hours: HourlyCount[],
  key: 'count' | 'uopsCount',
): Record<number, number> {
  const days: Record<number, number> = {}
  for (const hour of hours) {
    const day = UnixTime.toStartOf(hour.timestamp, 'day')
    days[day] = (days[day] ?? 0) + hour[key]
  }
  return days
}
