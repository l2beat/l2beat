import type { VoyagerClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { DayProvider } from './DayProviders'

export class StarknetDayProvider implements DayProvider {
  constructor(private voyagerClient: VoyagerClient) {}

  async getDailyTxsCount(
    from: number,
    to: number,
  ): Promise<Record<number, number>> {
    const dailyTxs = await this.voyagerClient.getDailyTxs()

    return Object.fromEntries(
      Object.entries(dailyTxs).filter(
        ([timestamp]) =>
          Number(timestamp) >= from * UnixTime.DAY &&
          Number(timestamp) < to * UnixTime.DAY,
      ),
    )
  }

  async getDailyUopsCount(
    from: number,
    to: number,
  ): Promise<Record<number, number>> {
    const dailyUops = await this.voyagerClient.getDailyUops()

    return Object.fromEntries(
      Object.entries(dailyUops).filter(
        ([timestamp]) =>
          Number(timestamp) >= from * UnixTime.DAY &&
          Number(timestamp) < to * UnixTime.DAY,
      ),
    )
  }
}
