import type { Logger } from '@l2beat/backend-tools'
import { type WatchDiff, watchDiffToMarkdown } from '@l2beat/discovery'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { assert, formatAsAsciiTable, UnixTime } from '@l2beat/shared-pure'
import { isNineAM } from '../update-monitor/utils/isNineAM'

export interface DailyWatchReminderEntry {
  name: string
  pendingItems: number
  changedPaths: number
}

export type WatchNotifyResult = 'sent' | 'no-client' | 'failed'

export class WatchNotifier {
  private loggedDiscordClientMissing = false

  constructor(
    private readonly discordClient: DiscordClient | undefined,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async handleUpdate(
    name: string,
    diff: WatchDiff[],
    timestamp: UnixTime,
  ): Promise<WatchNotifyResult> {
    const header = `Watch changes: ***${name}*** at timestamp ${timestamp}\n`
    const maxLength = DISCORD_MAX_MESSAGE_LENGTH - header.length
    const body = watchDiffToMarkdown(diff, maxLength)
    const result = await this.notify(`${header}${body}`, { watch: name })
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
  ): Promise<void> {
    if (!isNineAM(timestamp, 'CET')) {
      this.logger.info('Daily watch reminder not sent, not the right time', {
        date: UnixTime.toDate(timestamp).toISOString(),
      })
      return
    }

    if (entries.length === 0 && failedWatches.length === 0) {
      return
    }

    const header = formatHeader(timestamp, disabledWatches, failedWatches)
    const body = formatBody(entries, header)
    await this.notify(`${header}\n${body}\n`, { reminder: true })
    this.logger.info('Daily watch reminder sent', {
      entriesCount: entries.length,
      failedCount: failedWatches.length,
    })
  }

  private async notify(
    message: string,
    context: Record<string, unknown>,
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

    try {
      await this.discordClient.sendMessage(message)
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

function formatHeader(
  timestamp: UnixTime,
  disabledWatches: string[],
  failedWatches: string[],
): string {
  const disabledLine =
    disabledWatches.length > 0
      ? `:warning: Disabled watches: ${disabledWatches.map((w) => `\`${w}\``).join(', ')}\n`
      : ''
  const failedLine =
    failedWatches.length > 0
      ? `:warning: Failed watches: ${failedWatches.map((w) => `\`${w}\``).join(', ')}\n`
      : ''
  return `# Daily watch report @ ${UnixTime.toYYYYMMDD(timestamp)}\n${disabledLine}${failedLine}:hourglass: Pending watch changes`
}

function formatBody(
  entries: DailyWatchReminderEntry[],
  header: string,
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
  const safetyMargin = 10
  const maxLength = DISCORD_MAX_MESSAGE_LENGTH - header.length - safetyMargin
  return truncateBlock(`\`\`\`\n${table}\n`, maxLength, '```')
}

function truncateBlock(str: string, maxLength: number, suffix: string): string {
  const warning = '... (message too long)'
  assert(
    maxLength > warning.length + suffix.length,
    'maxLength must fit watch reminder overflow message',
  )
  if (str.length + suffix.length <= maxLength) {
    return str + suffix
  }
  return `${str.slice(0, maxLength - warning.length - suffix.length)}${warning}${suffix}`
}
