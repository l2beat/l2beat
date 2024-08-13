import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { StarkexClient } from '../../../../peripherals/starkex/StarkexClient'

export class StarkexTxsCountProvider {
  constructor(
    private readonly starkexClient: StarkexClient,
    private readonly projectId: ProjectId,
    private readonly productKeys: string[],
  ) {}

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (day) => {
      const productCounts = await Promise.all(
        this.productKeys.map(
          async (instance) =>
            await this.starkexClient.getDailyCount(day, instance),
        ),
      )

      return {
        count: productCounts.reduce((a, b) => a + b, 0),
        timestamp: UnixTime.fromDays(day),
      }
    })

    const counts = await Promise.all(queries)

    return counts.map((c) => ({
      projectId: this.projectId,
      timestamp: c.timestamp,
      count: c.count,
      start: c.timestamp.toStartOf('day').toNumber(),
      end: c.timestamp.add(1, 'days').add(-1, 'seconds').toNumber(),
    }))
  }
}
