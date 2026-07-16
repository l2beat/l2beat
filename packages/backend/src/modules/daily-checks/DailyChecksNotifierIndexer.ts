import type { Logger } from '@l2beat/backend-tools'
import type { DiscordClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'

export interface DailyChecksNotifierIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  discordClient: DiscordClient
  discordUserIds: string[]
  timezone: string
  hour: number
}

export class DailyChecksNotifierIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: DailyChecksNotifierIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.DAILY_CHECKS_NOTIFIER,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(_: number, to: number): Promise<number> {
    const tickHour = this.getHourInTimezone(to)
    if (tickHour !== this.$.hour) {
      this.logger.info('Skipping tick, not target hour', {
        tickHour,
        targetHour: this.$.hour,
        timezone: this.$.timezone,
      })
      return to
    }

    if (this.isWeekend(to)) {
      this.logger.info('Skipping tick, weekend', { timezone: this.$.timezone })
      return to
    }

    const userId = this.pickResponsibleUser(to)
    const message = this.buildMessage(userId)

    try {
      await this.$.discordClient.sendMessage(message)
      this.logger.info('Sent daily check notification', { userId })
    } catch (error) {
      this.logger.error('Failed to send daily check notification', { error })
    }

    return to
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }

  private buildMessage(userId: string): string {
    return `Good morning <@${userId}>! 🌅\nTime for the daily checks — please review the [Elasticsearch dashboards](https://backoffice.l2beat.com/website/daily-checks) for any syncing or other issues, just as before. Even though we now have an AI summary, please perform the review independently and then cross-check the AI summary to make sure it is accurate and has not missed anything. Leave ✅ once you have reviewed both.`
  }

  private pickResponsibleUser(timestamp: UnixTime): string {
    // Rotate every week.
    const weekIndex = this.getWeekIndex(UnixTime.toDate(timestamp))
    return this.$.discordUserIds[weekIndex % this.$.discordUserIds.length]
  }

  private getHourInTimezone(timestamp: UnixTime): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.$.timezone,
      hour: '2-digit',
      hour12: false,
    }).formatToParts(UnixTime.toDate(timestamp))
    const hour = Number(parts.find((p) => p.type === 'hour')?.value)
    return hour === 24 ? 0 : hour
  }

  private isWeekend(timestamp: UnixTime): boolean {
    const weekday = this.getWeekday(UnixTime.toDate(timestamp))
    return weekday === 'Sat' || weekday === 'Sun'
  }

  private getWeekday(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.$.timezone,
      weekday: 'short',
    }).formatToParts(date)
    const weekday = parts.find((p) => p.type === 'weekday')
    assert(weekday, 'Weekday not found')
    return weekday.value
  }

  private getWeekIndex(date: Date): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.$.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date)
    const year = Number(parts.find((p) => p.type === 'year')?.value)
    const month = Number(parts.find((p) => p.type === 'month')?.value)
    const day = Number(parts.find((p) => p.type === 'day')?.value)
    const dayNumber = Math.floor(
      Date.UTC(year, month - 1, day) / (24 * 60 * 60 * 1000),
    )
    // 1970-01-05 (epoch day 4) was a Monday.
    const daysSinceMonday = dayNumber - 4
    return Math.floor(daysSinceMonday / 7)
  }
}
