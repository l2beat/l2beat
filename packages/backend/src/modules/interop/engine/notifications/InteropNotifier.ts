import type { Logger } from '@l2beat/backend-tools'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { Retries, UnixTime } from '@l2beat/shared-pure'
import { TaskQueue } from '../../../../tools/queue/TaskQueue'
import type { InteropAggregationAnalysis } from '../aggregation/InteropAggregationAnalyzer'
import {
  diffInteropConfig,
  type InteropConfigDiff,
  interopConfigDiffToMarkdown,
  removeMutedInteropConfigDiffEntries,
} from '../config/InteropConfigDiff'

const MAX_ENTRIES_IN_MESSAGE = 200
const MAX_SUSPICIOUS_GROUPS_IN_MESSAGE = 20
const MAX_REASONS_PER_GROUP = 3
const MAX_SUSPICIOUS_TRANSFERS_IN_MESSAGE = 6

export interface InteropSuspiciousTransferNotification {
  plugin: string
  type: string
  transferId: string
  timestamp: UnixTime
  srcChain: string
  srcTxHash: string | undefined
  srcTokenAddress: string | undefined
  srcSymbol: string | undefined
  srcValueUsd: number
  dstChain: string
  dstTxHash: string | undefined
  dstTokenAddress: string | undefined
  dstSymbol: string | undefined
  dstValueUsd: number
  dominantSide: 'src' | 'dst'
  valueDifferencePercent: number
  valueRatio: number
}

export class InteropNotifier {
  private readonly messageQueue: TaskQueue<string>

  constructor(
    private readonly client: DiscordClient,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.messageQueue = new TaskQueue(
      async (message) => {
        await this.send(message)
      },
      this.logger.for('messageQueue'),
      {
        workers: 1,
        shouldRetry: Retries.exponentialBackOff({
          stepMs: 1000,
          maxAttempts: 5,
          maxDistanceMs: 60_000,
          notifyAfterAttempts: 3,
        }),
        shouldStopAfterFailedRetries: false,
        metricsId: InteropNotifier.name,
      },
    )
  }

  handleConfigChange(key: string, previous: unknown, current: unknown): void {
    const diff = diffInteropConfig(key, previous, current)
    const filteredDiff = removeMutedInteropConfigDiffEntries(diff)

    if (filteredDiff.entries.length === 0) {
      return
    }

    this.notifyConfigDiff(filteredDiff)
  }

  notifySuspiciousAggregates(
    timestamp: UnixTime,
    analysis: InteropAggregationAnalysis,
  ): void {
    if (analysis.suspiciousGroups.length === 0) {
      return
    }

    const renderedGroups = analysis.suspiciousGroups
      .slice(0, MAX_SUSPICIOUS_GROUPS_IN_MESSAGE)
      .map((group) => {
        const reasons = group.reasons.slice(0, MAX_REASONS_PER_GROUP).join('; ')
        const remainingReasons = group.reasons.length - MAX_REASONS_PER_GROUP
        const remainingSuffix =
          remainingReasons > 0 ? `; +${remainingReasons} more` : ''

        return `- \`${group.id}\` \`${group.bridgeType}\` \`${group.srcChain} -> ${group.dstChain}\`: ${reasons}${remainingSuffix}`
      })

    const remainingGroups =
      analysis.suspiciousGroups.length - MAX_SUSPICIOUS_GROUPS_IN_MESSAGE
    if (remainingGroups > 0) {
      renderedGroups.push(`- ...and ${remainingGroups} more groups`)
    }

    const message = [
      `🚨 Interop aggregate analysis flagged \`${analysis.suspiciousGroups.length}\` suspicious groups at \`${formatTimestamp(timestamp)}\``,
      '',
      ...renderedGroups,
    ].join('\n')

    this.messageQueue.addToBack(message)
  }

  notifySuspiciousTransfers(
    timestamp: UnixTime,
    transfers: InteropSuspiciousTransferNotification[],
  ): void {
    if (transfers.length === 0) {
      return
    }

    const renderedTransfers = transfers
      .slice(0, MAX_SUSPICIOUS_TRANSFERS_IN_MESSAGE)
      .map((transfer) => {
        const largerSide = transfer.dominantSide
        const smallerSide = largerSide === 'src' ? 'dst' : 'src'

        return `- \`${transfer.transferId}\` \`${transfer.plugin}\` \`${transfer.type}\` \`${transfer.srcSymbol} on ${transfer.srcChain} -> ${transfer.dstSymbol} on ${transfer.dstChain}\` ${formatDollars(transfer.srcValueUsd)} vs ${formatDollars(transfer.dstValueUsd)} (${formatRatio(transfer.valueRatio)} ${largerSide}/${smallerSide}, ${formatPercent(transfer.valueDifferencePercent)})`
      })

    const remainingTransfers =
      transfers.length - MAX_SUSPICIOUS_TRANSFERS_IN_MESSAGE
    if (remainingTransfers > 0) {
      renderedTransfers.push(`- ...and ${remainingTransfers} more transfers`)
    }

    const message = [
      `🕵🏻‍♂️ Interop financials flagged \`${transfers.length}\` suspicious transfers at \`${formatTimestamp(timestamp)}\``,
      '',
      ...renderedTransfers,
    ].join('\n')

    this.messageQueue.addToBack(message)
  }

  private notifyConfigDiff(diff: InteropConfigDiff): void {
    const header = `⚙️ **${diff.key}** config change - (\`${diff.entries.length}\` diff entries)`
    const markdown = interopConfigDiffToMarkdown(diff, MAX_ENTRIES_IN_MESSAGE)
    const message = `${header}\n\n${markdown}`

    this.messageQueue.addToBack(message)
  }

  private async send(message: string): Promise<void> {
    const truncated = this.truncate(message)
    await this.client.sendMessage(truncated)
    this.logger.debug('Notification sent', { message: truncated })
  }

  private truncate(input: string): string {
    if (input.length <= DISCORD_MAX_MESSAGE_LENGTH) {
      return input
    }
    const suffix = '\n...(truncated)'
    return input.slice(0, DISCORD_MAX_MESSAGE_LENGTH - suffix.length) + suffix
  }

  /**
   * WARNING: this method should be used only in tests
   */
  _TEST_ONLY_waitTillEmpty(): Promise<void> {
    return this.messageQueue.waitTillEmpty()
  }
}

function formatTimestamp(timestamp: UnixTime): string {
  return UnixTime.toDate(timestamp).toISOString().replace('.000Z', 'Z')
}

const dollarsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function formatDollars(value: number): string {
  return dollarsFormatter.format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`
}
