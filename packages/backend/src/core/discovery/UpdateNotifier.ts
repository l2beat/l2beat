import { Logger } from '@l2beat/backend-tools'
import { DiscoveryDiff } from '@l2beat/discovery'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'
import { Channel, DiscordClient } from '../../peripherals/discord/DiscordClient'
import { fieldThrottleDiff } from './fieldThrottleDiff'
import { diffToMessages } from './utils/diffToMessages'
import { filterDiff } from './utils/filterDiff'
import { isNineAM } from './utils/isNineAM'

export interface UpdateMetadata {
  blockNumber: number
  chainId: ChainId
  dependents: string[]
  unknownContracts: EthereumAddress[]
}

const OCCURRENCE_LIMIT = 3
const HOUR_RANGE = 12

export class UpdateNotifier {
  constructor(
    private readonly updateNotifierRepository: UpdateNotifierRepository,
    private readonly discordClient: DiscordClient | undefined,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async handleUpdate(
    name: string,
    diff: DiscoveryDiff[],
    metadata: UpdateMetadata,
  ) {
    // TODO(radomski): Discord notifications for chains different than
    // Ethereum are for now disabled. We still want to update the database
    // with the newest discovery but we don't want to notify about changes on
    // for example Arbitrum chain since there are a lot of changes that we
    // have not yet looked at.
    if (metadata.chainId !== ChainId.ETHEREUM) {
      return
    }

    const nonce = await this.getInternalMessageNonce()
    await this.updateNotifierRepository.add({
      projectName: name,
      diff,
      blockNumber: metadata.blockNumber,
      chainId: metadata.chainId,
    })

    const timeFence = UnixTime.now().add(-HOUR_RANGE, 'hours')
    const previousRecords = await this.updateNotifierRepository.getNewerThan(
      timeFence,
      name,
      metadata.chainId,
    )

    const throttled = fieldThrottleDiff(previousRecords, diff, OCCURRENCE_LIMIT)
    if (throttled.length <= 0) {
      this.logger.info('Updates detected, but everything got throttled', {
        name,
        amount: countDiff(throttled),
        throttledCount: diff.length - throttled.length,
      })

      return
    }

    const messages = diffToMessages(name, throttled, {
      dependents: metadata.dependents,
      blockNumber: metadata.blockNumber,
      chainId: metadata.chainId,
      nonce,
    })
    await this.notify(messages, 'INTERNAL')
    this.logger.info('Updates detected, notification sent [INTERNAL]', {
      name,
      amount: countDiff(throttled),
      throttledCount: diff.length - throttled.length,
    })

    const filteredDiff = filterDiff(throttled, metadata.unknownContracts)
    if (filteredDiff.length === 0) {
      return
    }
    const filteredMessages = diffToMessages(name, filteredDiff, {
      dependents: metadata.dependents,
      blockNumber: metadata.blockNumber,
      chainId: metadata.chainId,
    })
    await this.notify(filteredMessages, 'PUBLIC')
    this.logger.info('Updates detected, notification sent [PUBLIC]', {
      name,
      amount: countDiff(filteredDiff),
    })
  }

  async getInternalMessageNonce() {
    const latestId = await this.updateNotifierRepository.findLatestId()

    if (latestId === undefined) {
      return 0
    }

    return latestId + 1
  }

  private async notify(messages: string | string[], channel: Channel) {
    if (!this.discordClient) {
      // TODO: maybe only once? rethink
      this.logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
      return
    }

    const arrayMessages = Array.isArray(messages) ? messages : [messages]
    for (const message of arrayMessages) {
      await this.discordClient.sendMessage(message, channel).then(
        () => this.logger.debug('Notification to Discord has been sent'),
        (e) => this.logger.error('Discord API error', e),
      )
    }
  }

  async handleStart() {
    await this.notify('UpdateMonitor started.', 'INTERNAL')
    await this.notify('UpdateMonitor started.', 'PUBLIC')
    this.logger.info('Initial notifications sent')
  }

  async sendDailyReminder(
    reminders: Record<string, ChainId[]>,
    timestamp: UnixTime,
  ): Promise<void> {
    if (!isNineAM(timestamp, 'CET')) {
      return
    }

    let internals = ''
    if (Object.entries(reminders).length > 0) {
      const longestProjectName = Math.max(
        ...Object.keys(reminders).map((name) => name.length),
      )
      const messages = Object.entries(reminders).map(
        ([project, chains]) =>
          `- ${project.padEnd(longestProjectName, ' ')} (${chains
            .map((c) => ChainId.getName(c))
            .join(', ')})`,
      )

      internals = `\`\`\`\n${messages.join('\n')}\n\`\`\``
    } else {
      internals = ':white_check_mark: everything is up to date'
    }

    const notifyMessage = `${getDailyReminderHeader(timestamp)}\n${internals}\n`

    await this.notify(notifyMessage, 'INTERNAL')
    this.logger.info('Daily reminder sent', {
      reminders: reminders,
    })
  }
}

function getDailyReminderHeader(timestamp: UnixTime): string {
  return `# Daily bot report @ ${timestamp.toYYYYMMDD()}\n\n:x: Detected changes :x:`
}

function countDiff(diff: DiscoveryDiff[]): number {
  let count = 0

  for (const d of diff) {
    if (d.type === 'created' || d.type === 'deleted') {
      count++
    } else {
      count += (d.diff ?? []).length
    }
  }
  return count
}
