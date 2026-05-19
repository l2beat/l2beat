import type { Logger } from '@l2beat/backend-tools'
import type { DiscordClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'

export const DAILY_CHECKS_TIMEZONE = 'Europe/Warsaw'
export const DAILY_CHECKS_HOUR = 9

export interface DailyChecksNotifierIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  discordClient: DiscordClient
  discordUserIds: string[]
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

  override async update(_from: number, to: number): Promise<number> {
    const tickHour = getWarsawHour(to)
    if (tickHour !== DAILY_CHECKS_HOUR) {
      this.logger.info('Skipping tick, not 9AM Warsaw time', {
        tickHour,
        timeZone: DAILY_CHECKS_TIMEZONE,
      })
      return to
    }

    const userId = pickResponsibleUser(to, this.$.discordUserIds)
    const message = buildMessage(userId)

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
}

export function buildMessage(userId: string): string {
  return `Good morning <@${userId}>! 🌅\nTime for the daily checks — please review the [Elasticsearch dashboards](https://backoffice.l2beat.com/website/daily-checks) for any syncing or other issues. Leave ✅ if you have reviewed the dashboards.`
}

export function pickResponsibleUser(
  timestamp: UnixTime,
  users: string[],
): string {
  const weekIndex = getIsoWeekIndex(UnixTime.toDate(timestamp))
  return users[weekIndex % users.length]
}

export function getWarsawHour(timestamp: UnixTime): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DAILY_CHECKS_TIMEZONE,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(UnixTime.toDate(timestamp))
  const hour = Number(parts.find((p) => p.type === 'hour')?.value)
  return hour === 24 ? 0 : hour
}

export function getIsoWeekIndex(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DAILY_CHECKS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  const day = Number(parts.find((p) => p.type === 'day')?.value)
  const utc = new Date(Date.UTC(year, month - 1, day))
  const dayNum = utc.getUTCDay() === 0 ? 7 : utc.getUTCDay()
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const weekNumber = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000) + 1) / 7,
  )
  return utc.getUTCFullYear() * 53 + weekNumber
}
