import type { LighterClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { HourlyCount, HourlyCountsProvider } from './DayProviders'

export class LighterDayProvider implements HourlyCountsProvider {
  constructor(private lighterClient: LighterClient) {}

  async getHourlyCounts(from: UnixTime, to: UnixTime): Promise<HourlyCount[]> {
    // The whole history of full hours, each labelled with its end
    const hourlyStats = await this.lighterClient.getHourlyStats()
    return hourlyStats
      .map((stat) => ({ ...stat, timestamp: stat.timestamp - UnixTime.HOUR }))
      .filter((stat) => stat.timestamp >= from && stat.timestamp < to)
  }
}
