import type { ActivityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { DayProvider } from '../../../../providers/DayProviders'

export class DayTxsCountService {
  constructor(
    private readonly provider: DayProvider,
    private readonly projectId: ProjectId,
  ) {}

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<{
    records: ActivityRecord[]
    latestTimestamp: number
  }> {
    const queries = range(from, to + 1).map(async (day) => ({
      count: await this.provider.getDailyCount(day),
      timestamp: day * UnixTime.DAY,
    }))
    const counts = await Promise.all(queries)

    const latestTimestamp = counts.at(-1)?.timestamp
    assert(latestTimestamp, 'Latest timestamp is undefined')

    return {
      records: counts.map((c) => ({
        projectId: this.projectId,
        timestamp: c.timestamp,
        count: c.count,
        uopsCount: null,
        start: UnixTime.toStartOf(c.timestamp, 'day'),
        end: c.timestamp + 1 * UnixTime.DAY - 1,
      })),
      latestTimestamp,
    }
  }
}
