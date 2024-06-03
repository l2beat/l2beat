import { assert, Logger } from '@l2beat/backend-tools'
import { DiscoveryConfig, DiscoveryDiff } from '@l2beat/discovery'
import {
  ChainId,
  EthereumAddress,
  UnixTime,
  formatAsAsciiTable,
} from '@l2beat/shared-pure'
import { isEmpty } from 'lodash'

import {
  Channel,
  DiscordClient,
  MAX_MESSAGE_LENGTH,
} from '../../peripherals/discord/DiscordClient'
import { ChainConverter } from '../../tools/ChainConverter'
import { fieldThrottleDiff } from './fieldThrottleDiff'
import { UpdateNotifierRepository } from './repositories/UpdateNotifierRepository'
import { diffToMessage } from './utils/diffToMessage'
import { filterDiff } from './utils/filterDiff'
import { isNineAM } from './utils/isNineAM'

export interface DailyReminderChainEntry {
  chainName: string
  severityCounts: {
    low: number
    medium: number
    high: number
    unknown: number
  }
}

const OCCURRENCE_LIMIT = 3
const HOUR_RANGE = 12

export class UpdateNotifier {
  constructor(
    private readonly updateNotifierRepository: UpdateNotifierRepository,
    private readonly discordClient: DiscordClient | undefined,
    private readonly chainConverter: ChainConverter,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async handleUpdate(
    name: string,
    diff: DiscoveryDiff[],
    config: DiscoveryConfig | undefined,
    blockNumber: number,
    chainId: ChainId,
    dependents: string[],
    unknownContracts: EthereumAddress[],
  ) {
    const nonce = await this.getInternalMessageNonce()
    await this.updateNotifierRepository.add({
      projectName: name,
      diff,
      blockNumber: blockNumber,
      chainId: chainId,
    })

    const timeFence = UnixTime.now().add(-HOUR_RANGE, 'hours')
    const previousRecords = await this.updateNotifierRepository.getNewerThan(
      timeFence,
      name,
      chainId,
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

    const message = diffToMessage(
      name,
      throttled,
      config,
      blockNumber,
      this.chainConverter.toName(chainId),
      dependents,
      nonce,
    )
    await this.notify(message, 'INTERNAL')
    this.logger.info('Updates detected, notification sent [INTERNAL]', {
      name,
      amount: countDiff(throttled),
      throttledCount: diff.length - throttled.length,
    })

    const filteredDiff = filterDiff(throttled, unknownContracts)
    if (filteredDiff.length === 0) {
      return
    }
    const filteredMessage = diffToMessage(
      name,
      filteredDiff,
      config,
      blockNumber,
      this.chainConverter.toName(chainId),
      dependents,
    )
    await this.notify(filteredMessage, 'PUBLIC')
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
    reminders: Record<string, DailyReminderChainEntry[]>,
    timestamp: UnixTime,
  ): Promise<void> {
    if (!isNineAM(timestamp, 'CET')) {
      return
    }

    let internals = ''
    const header = `${getDailyReminderHeader(timestamp)}\n${internals}\n`

    if (!isEmpty(reminders)) {
      const monospaceBlockFence = '```'
      const safetyMargin = 10
      const maxLength = MAX_MESSAGE_LENGTH - header.length - safetyMargin
      const table = formatRemindersAsTable(reminders)
      internals = handleOverflow(
        `\`\`\`\n${table}\n`,
        maxLength,
        monospaceBlockFence,
      )
    } else {
      internals = ':white_check_mark: everything is up to date'
    }

    const notifyMessage = `${getDailyReminderHeader(timestamp)}\n${internals}\n`

    await this.notify(notifyMessage, 'INTERNAL')
    this.logger.info('Daily reminder sent', { reminders })
  }
}

function formatRemindersAsTable(
  reminders: Record<string, DailyReminderChainEntry[]>,
): string {
  const headers = ['Project', 'Chain', 'High', 'Mid', 'Low', '???']

  const flat = flattenReminders(reminders)
  const sorted = flat.sort((a, b) => {
    const {
      low: aLow,
      medium: aMedium,
      high: aHigh,
      unknown: aUnknown,
    } = a.chainEntry.severityCounts
    const {
      low: bLow,
      medium: bMedium,
      high: bHigh,
      unknown: bUnknown,
    } = b.chainEntry.severityCounts

    const aSum = aHigh * 1e9 + aMedium * 1e6 + aLow * 1e3 + aUnknown
    const bSum = bHigh * 1e9 + bMedium * 1e6 + bLow * 1e3 + bUnknown

    return bSum - aSum
  })

  const rows = sorted.map(({ projectName, chainEntry }) => {
    const { chainName, severityCounts: s } = chainEntry
    return [
      projectName,
      chainName,
      s.high === 0 ? '' : s.high.toString(),
      s.medium === 0 ? '' : s.medium.toString(),
      s.low === 0 ? '' : s.low.toString(),
      s.unknown === 0 ? '' : s.unknown.toString(),
    ]
  })

  return formatAsAsciiTable(headers, rows)
}

function flattenReminders(
  reminders: Record<string, DailyReminderChainEntry[]>,
): {
  projectName: string
  chainEntry: DailyReminderChainEntry
}[] {
  const entries: {
    projectName: string
    chainEntry: DailyReminderChainEntry
  }[] = []

  Object.entries(reminders).forEach(([key, values]) => {
    values.forEach((chainEntry) => {
      entries.push({ projectName: key, chainEntry })
    })
  })

  return entries
}

function getDailyReminderHeader(timestamp: UnixTime): string {
  return `# Daily bot report @ ${timestamp.toYYYYMMDD()}\n\n:x: Detected changes with following severities :x:`
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

function handleOverflow(
  str: string,
  maxLength: number,
  userSuffix = '',
): string {
  const WARNING_MESSAGE = '... (message too long)'
  assert(
    maxLength > WARNING_MESSAGE.length + userSuffix.length,
    'maxLength must be greater than WARNING_MESSAGE.length + userSuffix.length',
  )

  if (str.length + userSuffix.length <= maxLength) {
    return str + userSuffix
  }

  return `${str.substring(
    0,
    maxLength - WARNING_MESSAGE.length - userSuffix.length,
  )}${WARNING_MESSAGE}${userSuffix}`
}
