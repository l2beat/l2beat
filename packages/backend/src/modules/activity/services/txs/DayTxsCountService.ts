import type { ActivityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { DayProvider } from '../../../../providers/day/DayProviders'

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
    records: ActivityRecord[]
    latestTimestamp: number
  }> {
    const dailyTxs = await this.$.provider.getDailyTxsCount(from, to)
    const dailyUops = await this.$.provider.getDailyUopsCount(from, to)

    const latestTimestamp = Math.max(
      ...Object.keys(dailyTxs).map(Number),
      ...Object.keys(dailyUops).map(Number),
    )
    assert(latestTimestamp, 'Latest timestamp is undefined')

    // from and to are inclusive, so we need to add 1 to the end
    const records: ActivityRecord[] = range(from, to + 1).map((day) => {
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
      }
    })

    return {
      records,
      latestTimestamp,
    }
  }
}
