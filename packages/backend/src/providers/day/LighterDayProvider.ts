import type { LighterClient } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { HourlyCount, HourlyCountsProvider } from './DayProviders'

export class LighterDayProvider implements HourlyCountsProvider {
  constructor(private lighterClient: LighterClient) {}

  async getHourlyCounts(from: UnixTime, to: UnixTime): Promise<HourlyCount[]> {
    // The whole history, with the hour still going on
    const hourlyStats = await this.lighterClient.getHourlyStats()
    return hourlyStats.filter(
      (stat) => stat.timestamp >= from && stat.timestamp < to,
    )
  }
}
