import type { StarkexClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { DayProvider } from './DayProviders'

export class StarkexDayProvider implements DayProvider {
  constructor(
    private starkexClient: StarkexClient,
    private products: string[],
  ) {}

  async getDailyTxsCount(
    from: number,
    to: number,
  ): Promise<Record<number, number>> {
    const queries = range(from, to).map(async (day) => ({
      timestamp: day * UnixTime.DAY,
      count: await this.getTxCountForTimestamp(day),
    }))
    const counts = await Promise.all(queries)
    return Object.fromEntries(counts.map((c) => [c.timestamp, c.count]))
  }

  private async getTxCountForTimestamp(day: number): Promise<number> {
    const counts = await Promise.all(
      this.products.map((product) =>
        this.starkexClient.getDailyCount(day, product),
      ),
    )
    return counts.reduce((a, b) => a + b, 0)
  }

  getDailyUopsCount(_: number, __: number): Promise<Record<number, number>> {
    // API does not expose this metric
    return Promise.resolve({})
  }
}
