import type { ActivityRecord } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import type { DayProvider } from '../../../../providers/DayProviders'

export class DayTxsCountService {
  constructor(
    private readonly provider: DayProvider,
    private readonly projectId: ProjectId,
  ) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (day) => ({
      count: await this.provider.getDailyCount(day),
      timestamp: UnixTime.fromDays(day),
    }))
    const counts = await Promise.all(queries)

    return counts.map((c) => ({
      projectId: this.projectId,
      timestamp: c.timestamp,
      count: c.count,
      uopsCount: null,
      start: c.timestamp.toStartOf('day').toNumber(),
      end: c.timestamp.add(1, 'days').add(-1, 'seconds').toNumber(),
    }))
  }
}
