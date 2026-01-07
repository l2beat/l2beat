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

    const dailyData = new Map<number, number>()

    for (const stat of hourlyStats) {
      const dayStart = UnixTime.toStartOf(stat.timestamp, 'day')

      if (dayStart >= from * UnixTime.DAY && dayStart < to * UnixTime.DAY) {
        const current = dailyData.get(dayStart) ?? 0
        dailyData.set(dayStart, current + stat.count)
      }
    }

    return Object.fromEntries(dailyData)
  }

  async getDailyUopsCount(
    from: number,
    to: number,
  ): Promise<Record<number, number>> {
    const hourlyStats = await this.lighterClient.getHourlyStats()

    const dailyData = new Map<number, number>()

    for (const stat of hourlyStats) {
      const dayStart = UnixTime.toStartOf(stat.timestamp, 'day')

      if (dayStart >= from * UnixTime.DAY && dayStart < to * UnixTime.DAY) {
        const current = dailyData.get(dayStart) ?? 0
        dailyData.set(dayStart, current + stat.uopsCount)
      }
    }

    return Object.fromEntries(dailyData)
  }
}
