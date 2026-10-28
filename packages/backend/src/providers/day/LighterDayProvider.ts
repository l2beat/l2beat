import type { LighterClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { HourlyCount, HourlyCountsProvider } from './DayProviders'

export class LighterDayProvider implements HourlyCountsProvider {
  constructor(private lighterClient: LighterClient) {}

  async getHourlyCounts(from: number, to: number): Promise<HourlyCount[]> {
    const hourlyStats = await this.lighterClient.getHourlyStats()
    return hourlyStats.filter(
      (stat) =>
        stat.timestamp >= from * UnixTime.DAY &&
        stat.timestamp < to * UnixTime.DAY,
    )
  }
}
