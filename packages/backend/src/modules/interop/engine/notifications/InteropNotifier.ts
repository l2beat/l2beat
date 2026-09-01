import type { Logger } from '@l2beat/backend-tools'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { Retries, UnixTime } from '@l2beat/shared-pure'
import { TaskQueue } from '../../../../tools/queue/TaskQueue'
import {
  diffInteropConfig,
  type InteropConfigDiff,
  interopConfigDiffToMarkdown,
  removeMutedInteropConfigDiffEntries,
} from '../config/InteropConfigDiff'
import type { RuleViolation } from '../promotion/types'

const MAX_ENTRIES_IN_MESSAGE = 200
const MAX_BLOCKED_REASONS_IN_MESSAGE = 20
const MAX_SUSPICIOUS_TRANSFERS_IN_MESSAGE = 6
const MAX_SKIPPED_VALUATIONS_IN_MESSAGE = 10

const BACKOFFICE_URL = 'https://backoffice.l2beat.com'

export type BackofficeEnvironment = 'local' | 'staging' | 'production'

export interface InteropNotifierOptions {
  backofficeEnvironment?: BackofficeEnvironment
}

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

export interface InteropSkippedTransferValuationNotification {
  plugin: string
  type: string
  transferId: string
  srcChain: string
  dstChain: string
  side: 'src' | 'dst'
  symbol: string | undefined
  coingeckoId: string
  priceUsd: number
  amount: number
  valueUsd: number | undefined
  reason: 'priceAboveThreshold' | 'valueAboveThreshold'
  thresholdUsd: number
}

export class InteropNotifier {
  private readonly messageQueue: TaskQueue<string>
  private readonly backofficeEnvironment: BackofficeEnvironment | undefined

  constructor(
    private readonly client: DiscordClient,
    private readonly logger: Logger,
    options: InteropNotifierOptions = {},
  ) {
    this.logger = logger.for(this)
    this.backofficeEnvironment = options.backofficeEnvironment
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

  notifyBlockedSnapshot(timestamp: UnixTime, reasons: RuleViolation[]): void {
    if (reasons.length === 0) {
      return
    }

    const renderedReasons = reasons
      .slice(0, MAX_BLOCKED_REASONS_IN_MESSAGE)
      .map((reason) => `- ${reason.message}`)

    const remainingReasons = reasons.length - MAX_BLOCKED_REASONS_IN_MESSAGE
    if (remainingReasons > 0) {
      renderedReasons.push(`- ...and ${remainingReasons} more`)
    }

    const link = this.backofficeLink('/interop/promotion', String(timestamp))

    const message = [
      `⛔ Interop snapshot \`${formatTimestamp(timestamp)}\` blocked from promotion - needs manual review`,
      ...(link ? [`[Review in backoffice ↗](${link})`] : []),
      '',
      ...renderedReasons,
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

        const link = this.backofficeLink(
          '/interop/insights/activity/suspicious-transfers',
          transfer.transferId,
        )
        const linkSuffix = link ? ` [↗](${link})` : ''

        return `- \`${transfer.transferId}\` \`${transfer.plugin}\` \`${transfer.type}\` \`${transfer.srcSymbol} on ${transfer.srcChain} -> ${transfer.dstSymbol} on ${transfer.dstChain}\` ${formatDollars(transfer.srcValueUsd)} vs ${formatDollars(transfer.dstValueUsd)} (${formatRatio(transfer.valueRatio)} ${largerSide}/${smallerSide}, ${formatPercent(transfer.valueDifferencePercent)})${linkSuffix}`
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

  notifySkippedTransferValuations(
    timestamp: UnixTime,
    valuations: InteropSkippedTransferValuationNotification[],
  ): void {
    if (valuations.length === 0) {
      return
    }

    const renderedValuations = valuations
      .slice(0, MAX_SKIPPED_VALUATIONS_IN_MESSAGE)
      .map((valuation) => {
        const path = `${valuation.srcChain} -> ${valuation.dstChain}`
        const symbol = valuation.symbol ?? valuation.coingeckoId

        if (valuation.reason === 'priceAboveThreshold') {
          return `- \`${valuation.transferId}\` \`${valuation.plugin}\` \`${valuation.type}\` \`${valuation.side}\` \`${symbol}\` on ${path}: skipped valuation because price ${formatDollars(valuation.priceUsd)} is above ${formatDollars(valuation.thresholdUsd)}`
        }

        return `- \`${valuation.transferId}\` \`${valuation.plugin}\` \`${valuation.type}\` \`${valuation.side}\` \`${symbol}\` on ${path}: skipped value ${formatDollars(valuation.valueUsd ?? 0)} above ${formatDollars(valuation.thresholdUsd)} at price ${formatDollars(valuation.priceUsd)} and amount ${formatAmount(valuation.amount)}`
      })

    const remainingValuations =
      valuations.length - MAX_SKIPPED_VALUATIONS_IN_MESSAGE
    if (remainingValuations > 0) {
      renderedValuations.push(`- ...and ${remainingValuations} more valuations`)
    }

    const message = [
      `⚠️ Interop financials skipped \`${valuations.length}\` transfer valuations at \`${formatTimestamp(timestamp)}\``,
      '',
      ...renderedValuations,
    ].join('\n')

    this.messageQueue.addToBack(message)
  }

  private notifyConfigDiff(diff: InteropConfigDiff): void {
    const header = `⚙️ **${diff.key}** config change - (\`${diff.entries.length}\` diff entries)`
    const markdown = interopConfigDiffToMarkdown(diff, MAX_ENTRIES_IN_MESSAGE)
    const message = `${header}\n\n${markdown}`

    this.messageQueue.addToBack(message)
  }

  private backofficeLink(path: string, rowKey: string): string | undefined {
    if (!this.backofficeEnvironment) {
      return undefined
    }
    const env = encodeURIComponent(this.backofficeEnvironment)
    const hash = encodeURIComponent(rowKey)
    return `${BACKOFFICE_URL}${path}?env=${env}#${hash}`
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
const amountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 6,
})

function formatDollars(value: number): string {
  return dollarsFormatter.format(value)
}

function formatAmount(value: number): string {
  return amountFormatter.format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`
}
