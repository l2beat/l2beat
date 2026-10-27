import type { HourlyActivityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { DayProvider } from '../../../../providers/day/DayProviders'
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
    const dailyTxs = await this.$.provider.getDailyTxsCount(from, to)
    const dailyUops = await this.$.provider.getDailyUopsCount(from, to)
    const hours = (await this.$.provider.getHourlyCounts?.(from, to))?.map(
      (hour) => ({ projectId: this.$.projectId, ...hour }),
    )

    const latestTimestamp = Math.max(
      ...Object.keys(dailyTxs).map(Number),
      ...Object.keys(dailyUops).map(Number),
    )
    assert(latestTimestamp, 'Latest timestamp is undefined')

    const records: DayActivityRecord[] = range(from, to).map((day) => {
      const timestamp = day * UnixTime.DAY
      const count = dailyTxs[timestamp]
      assert(count !== undefined, 'Count is undefined')
      // Fetched apart from the days, so a day can come without its hours
      assert(
        !hours ||
          hours.some(
            (hour) => UnixTime.toStartOf(hour.timestamp, 'day') === timestamp,
          ),
        'Hours are missing',
      )
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
