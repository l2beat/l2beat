import type { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { pluralize, UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { matchEthereumProject } from '../services/DaService'

interface Dependencies extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configurations: EthereumDaTrackingConfig[]
  discordClient: DiscordClient
}

export interface UnmatchedBlobPair {
  from: string
  to: string | null
  count: number
}

const COUNT_THRESHOLD = 100

/**
 * This indexer is used to notify about unmatched blob pairs for Ethereum.
 * It is run daily and checks for unmatched blob pairs for the previous day.
 * If there are any unmatched blob pairs, it will notify about them on discord channel.
 */
export class EthereumBlobNotifierIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: Dependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.ETHEREUM_BLOB_NOTIFIER,
      },
      logger,
    )
  }

  async update(_from: number, to: number): Promise<number> {
    // Only run at 1 AM UTC, when we are sure that we have blobs for the previous day
    if (UnixTime.toStartOf(to, 'day') + 1 * UnixTime.HOUR !== to) {
      this.logger.info('Skipping update', { to })
      return to
    }

    this.logger.info('Checking for unmatched blob pairs', { to })
    const unmatchedPairs = await this.getUnmatchedPairs(to)

    if (unmatchedPairs.length === 0) {
      this.logger.info('No unmatched blob pairs found')
      return to
    }

    this.logger.info('Found unmatched blob pairs', {
      count: unmatchedPairs.length,
    })

    const messages = this.formatDiscordMessages(unmatchedPairs, to)
    for (const message of messages) {
      await this.$.discordClient.sendMessage(message)
    }
    this.logger.info('Sent Discord notification')

    return to
  }

  async getUnmatchedPairs(to: number): Promise<UnmatchedBlobPair[]> {
    const todayStart = UnixTime.toStartOf(to, 'day')
    const yesterdayStart = todayStart - UnixTime.DAY

    const pairs = await this.$.db.blobs.getCountPerAddressInbox(
      'ethereum',
      yesterdayStart,
      todayStart,
    )

    const unmatchedPairs: UnmatchedBlobPair[] = []

    for (const pair of pairs) {
      if (pair.count < COUNT_THRESHOLD) continue

      const isMatched = this.$.configurations.some((config) =>
        matchEthereumProject(
          {
            inbox: pair.to ?? '',
            sequencer: pair.from,
            topics: [],
          },
          config,
        ),
      )

      if (!isMatched) {
        unmatchedPairs.push(pair)
      }
    }

    return unmatchedPairs
  }

  formatDiscordMessages(pairs: UnmatchedBlobPair[], to: number): string[] {
    const date = new Date((UnixTime.toStartOf(to, 'day') - UnixTime.DAY) * 1000)
      .toISOString()
      .slice(0, 10)

    const sorted = [...pairs].sort((a, b) => b.count - a.count)

    const header = [
      `**Unmatched Ethereum Blob Pairs** (${date})`,
      `Found **${pairs.length}** address ${pluralize(pairs.length, 'pair')} with ${COUNT_THRESHOLD}+ blobs not matching any project config:`,
      '',
    ].join('\n')

    const messages: string[] = []
    let current = header

    for (const p of sorted) {
      const line = `\`${p.from}\` → \`${p.to ?? 'null'}\` — **${p.count}** blobs`

      if (current.length + 1 + line.length > DISCORD_MAX_MESSAGE_LENGTH) {
        messages.push(current)
        current = line
      } else {
        current += '\n' + line
      }
    }

    messages.push(current)
    return messages
  }

  async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
