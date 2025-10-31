import type { LighterClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { DayProvider } from './DayProviders'

export class LighterDayProvider implements DayProvider {
  constructor(private lighterClient: LighterClient) {}

  async getDailyTxsCount(
    from: number,
    to: number,
  ): Promise<Record<number, number>> {
    const hourlyStats = await this.lighterClient.getHourlyStats()

    // Group hourly data by day and sum
    const dailyData = new Map<number, number>()

    for (const stat of hourlyStats) {
      const timestamp = UnixTime(stat.timestamp)
      const dayStart = UnixTime.toStartOf(timestamp, 'day')
      const dayTimestamp = dayStart

      // Filter by date range
      if (
        dayTimestamp >= from * UnixTime.DAY &&
        dayTimestamp < to * UnixTime.DAY
      ) {
        const current = dailyData.get(dayTimestamp) ?? 0
        dailyData.set(dayTimestamp, current + stat.count)
      }
    }

    return Object.fromEntries(dailyData)
  }

  async getDailyUopsCount(
    from: number,
    to: number,
  ): Promise<Record<number, number>> {
    const hourlyStats = await this.lighterClient.getHourlyStats()

    // Group hourly data by day and sum
    const dailyData = new Map<number, number>()

    for (const stat of hourlyStats) {
      const timestamp = UnixTime(stat.timestamp)
      const dayStart = UnixTime.toStartOf(timestamp, 'day')
      const dayTimestamp = dayStart

      // Filter by date range
      if (
        dayTimestamp >= from * UnixTime.DAY &&
        dayTimestamp < to * UnixTime.DAY
      ) {
        const current = dailyData.get(dayTimestamp) ?? 0
        dailyData.set(dayTimestamp, current + stat.uopsCount)
      }
    }

    return Object.fromEntries(dailyData)
  }
}
