import type { Logger } from '@l2beat/backend-tools'
import { type WatchDiff, watchDiffToMarkdown } from '@l2beat/discovery'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { formatAsAsciiTable, UnixTime } from '@l2beat/shared-pure'

export interface DailyWatchReminderEntry {
  name: string
  pendingItems: number
  changedPaths: number
}

export type WatchNotifyResult = 'sent' | 'no-client' | 'failed'

const REMINDER_TIMEZONE = 'Europe/Warsaw'
const WARSAW_HOUR_FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: REMINDER_TIMEZONE,
  hour: '2-digit',
  hour12: false,
})
const WARSAW_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: REMINDER_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const MAX_LIST_LINE_CHARS = 400
const OVERFLOW_WARNING = '... (message too long)'
const DEFAULT_SEND_TIMEOUT_MS = 30_000

export class WatchNotifier {
  private loggedDiscordClientMissing = false

  constructor(
    private readonly discordClient: DiscordClient | undefined,
    private readonly logger: Logger,
    private readonly safeTimeOffsetSeconds: number = UnixTime.HOUR,
  ) {
    this.logger = this.logger.for(this)
  }

  async handleUpdate(
    name: string,
    diff: WatchDiff[],
    timestamp: UnixTime,
    signal?: AbortSignal,
  ): Promise<WatchNotifyResult> {
    const header = `Watch changes: ***${name}*** at timestamp ${timestamp}\n`
    const maxLength = DISCORD_MAX_MESSAGE_LENGTH - header.length
    const body = watchDiffToMarkdown(diff, maxLength)
    const result = await this.notify(
      `${header}${body}`,
      { watch: name },
      signal,
    )
    if (result === 'sent') {
      this.logger.info('Watch changes notification sent', {
        watch: name,
        keys: diff.length,
      })
    }
    return result
  }

  async sendDailyReminder(
    entries: DailyWatchReminderEntry[],
    timestamp: UnixTime,
    disabledWatches: string[],
    failedWatches: string[],
  ): Promise<WatchNotifyResult> {
    const deliveryTimestamp = timestamp + this.safeTimeOffsetSeconds
    if (!isNineAMWarsaw(deliveryTimestamp)) {
      this.logger.info('Daily watch reminder not sent, not the right time', {
        date: UnixTime.toDate(deliveryTimestamp).toISOString(),
      })
      return 'no-client'
    }

    if (entries.length === 0 && failedWatches.length === 0) {
      return 'no-client'
    }

    const message = formatDailyReminderMessage(
      deliveryTimestamp,
      entries,
      disabledWatches,
      failedWatches,
    )
    const result = await this.notify(message, { reminder: true })
    if (result === 'sent') {
      this.logger.info('Daily watch reminder sent', {
        entriesCount: entries.length,
        failedCount: failedWatches.length,
      })
    }
    return result
  }

  private async notify(
    message: string,
    context: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<WatchNotifyResult> {
    if (!this.discordClient) {
      if (!this.loggedDiscordClientMissing) {
        this.logger.info(
          'DiscordClient not setup, watch notification has not been sent',
        )
        this.loggedDiscordClientMissing = true
      }
      return 'no-client'
    }

    const timeoutSignal = AbortSignal.timeout(DEFAULT_SEND_TIMEOUT_MS)
    const effectiveSignal =
      signal !== undefined
        ? AbortSignal.any([signal, timeoutSignal])
        : timeoutSignal
    try {
      await this.discordClient.sendMessage(message, effectiveSignal)
      return 'sent'
    } catch (error) {
      this.logger.error('Discord API error', error, {
        ...context,
        messageLength: message.length,
      })
      return 'failed'
    }
  }
}

export function isNineAMWarsaw(deliveryTimestamp: UnixTime): boolean {
  const hourStart = UnixTime.toStartOf(deliveryTimestamp, 'hour')
  return WARSAW_HOUR_FORMAT.format(UnixTime.toDate(hourStart)) === '09'
}

export function formatDailyReminderMessage(
  deliveryTimestamp: UnixTime,
  entries: DailyWatchReminderEntry[],
  disabledWatches: string[],
  failedWatches: string[],
): string {
  const date = WARSAW_DATE_FORMAT.format(UnixTime.toDate(deliveryTimestamp))
  const headerLines = [`# Daily watch report @ ${date}`]
  if (disabledWatches.length > 0) {
    headerLines.push(
      formatBoundedList(
        ':warning: Disabled watches: ',
        disabledWatches,
        MAX_LIST_LINE_CHARS,
      ),
    )
  }
  if (failedWatches.length > 0) {
    headerLines.push(
      formatBoundedList(
        ':warning: Failed watches: ',
        failedWatches,
        MAX_LIST_LINE_CHARS,
      ),
    )
  }
  headerLines.push(':hourglass: Pending watch changes')
  const header = `${headerLines.join('\n')}\n`

  const remaining = DISCORD_MAX_MESSAGE_LENGTH - header.length - 1
  const body = formatBody(entries, remaining)
  const full = `${header}${body}\n`
  if (full.length <= DISCORD_MAX_MESSAGE_LENGTH) {
    return full
  }
  return `${full.slice(0, DISCORD_MAX_MESSAGE_LENGTH - OVERFLOW_WARNING.length)}${OVERFLOW_WARNING}`
}

function formatBoundedList(
  prefix: string,
  names: string[],
  maxChars: number,
): string {
  const shown: string[] = []
  let length = prefix.length
  for (let i = 0; i < names.length; i++) {
    const item = `\`${names[i]}\``
    const sep = shown.length > 0 ? ', ' : ''
    const remaining = names.length - i - 1
    const moreSuffix = remaining > 0 ? `, ... (+${remaining} more)` : ''
    if (
      shown.length > 0 &&
      length + sep.length + item.length + moreSuffix.length > maxChars
    ) {
      const skipped = names.length - shown.length
      return `${prefix}${shown.join(', ')}, ... (+${skipped} more)`
    }
    shown.push(item)
    length += sep.length + item.length
  }
  return `${prefix}${shown.join(', ')}`
}

function formatBody(
  entries: DailyWatchReminderEntry[],
  maxLength: number,
): string {
  if (entries.length === 0) {
    return ':white_check_mark: no pending watch changes'
  }
  const sorted = [...entries].sort((a, b) => {
    if (b.pendingItems !== a.pendingItems) {
      return b.pendingItems - a.pendingItems
    }
    if (b.changedPaths !== a.changedPaths) {
      return b.changedPaths - a.changedPaths
    }
    return a.name.localeCompare(b.name)
  })
  const rows = sorted.map((entry) => [
    entry.name,
    entry.pendingItems.toString(),
    entry.changedPaths.toString(),
  ])
  const table = formatAsAsciiTable(['Watch', 'Pending', 'Changed'], rows)
  const fenced = `\`\`\`\n${table}\n\`\`\``
  if (fenced.length <= maxLength) {
    return fenced
  }
  const suffix = `\n${OVERFLOW_WARNING}\n\`\`\``
  const minFit = '```\n'.length + suffix.length
  if (maxLength < minFit) {
    return `${entries.length} watch(es) with pending changes`
  }
  return `${`\`\`\`\n${table}`.slice(0, maxLength - suffix.length)}${suffix}`
}
