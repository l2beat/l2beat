import type { Logger } from '@l2beat/backend-tools'
import { type ProjectScalingStack, ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { type DiscoveryDiff, discoveryDiffToMarkdown } from '@l2beat/discovery'
import {
  assert,
  type ChainConverter,
  type ChainId,
  type EthereumAddress,
  formatAsAsciiTable,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'
import {
  type Channel,
  type DiscordClient,
  MAX_MESSAGE_LENGTH,
} from '../../peripherals/discord/DiscordClient'
import { fieldThrottleDiff } from './fieldThrottleDiff'
import type { UpdateMessagesService } from './UpdateMessagesService'
import { diffToMessage } from './utils/diffToMessage'
import { filterDiff } from './utils/filterDiff'
import { isNineAM } from './utils/isNineAM'

export interface DailyReminderChainEntry {
  chainName: string
  severityCounts: {
    low: number
    high: number
    unknown: number
  }
}

const OCCURRENCE_LIMIT = 3
const HOUR_RANGE = 12

export class UpdateNotifier {
  constructor(
    private readonly db: Database,
    private readonly discordClient: DiscordClient | undefined,
    private readonly chainConverter: ChainConverter,
    private readonly logger: Logger,
    private readonly updateMessagesService: UpdateMessagesService,
    private readonly projectService: ProjectService,
    private readonly disabledChains: string[],
  ) {
    this.logger = this.logger.for(this)
  }

  async handleUpdate(
    name: string,
    diff: DiscoveryDiff[],
    chainId: ChainId,
    dependents: string[],
    unknownContracts: EthereumAddress[],
    timestamp: UnixTime,
  ) {
    const nonce = await this.getInternalMessageNonce()
    await this.db.updateNotifier.insert({
      projectId: name,
      diff,
      timestamp: timestamp,
      chainId: chainId,
    })

    const timeFence = UnixTime.now() - HOUR_RANGE * UnixTime.HOUR
    const previousRecords = await this.db.updateNotifier.getNewerThan(
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

    const trackedTxsAffected = await canTrackedTxsBeAffected(
      this.projectService,
      name,
      throttled,
    )

    const message = diffToMessage(
      name,
      throttled,
      timestamp,
      this.chainConverter.toName(chainId),
      dependents,
      nonce,
      trackedTxsAffected,
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
      timestamp,
      this.chainConverter.toName(chainId),
      dependents,
      undefined,
    )
    await this.notify(filteredMessage, 'PUBLIC')

    const filteredWebMessage = discoveryDiffToMarkdown(filteredDiff)

    await this.updateMessagesService.storeAndPrune({
      projectId: name,
      chain: this.chainConverter.toName(chainId),
      message: filteredWebMessage,
      timestamp,
    })

    this.logger.info('Updates detected, notification sent [PUBLIC]', {
      name,
      amount: countDiff(filteredDiff),
    })
  }

  async getInternalMessageNonce() {
    const latestId = await this.db.updateNotifier.findLatestId()

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
      this.logger.info('Daily reminder not sent, not the right time', {
        date: UnixTime.toDate(timestamp).toISOString(),
      })
      return
    }

    let internals = ''
    const header = `${await getDailyReminderHeader(
      timestamp,
      this.disabledChains,
    )}\n${internals}\n`

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

    const notifyMessage = `${await getDailyReminderHeader(
      timestamp,
      this.disabledChains,
    )}\n${internals}\n`

    await this.notify(notifyMessage, 'INTERNAL')
    this.logger.info('Daily reminder sent', { reminders })
  }
}

function formatRemindersAsTable(
  reminders: Record<string, DailyReminderChainEntry[]>,
): string {
  const headers = ['Project', 'Chain', 'High', 'Low', '???']

  const flat = flattenReminders(reminders)
  const sorted = flat.sort((a, b) => {
    const {
      low: aLow,
      high: aHigh,
      unknown: aUnknown,
    } = a.chainEntry.severityCounts
    const {
      low: bLow,
      high: bHigh,
      unknown: bUnknown,
    } = b.chainEntry.severityCounts

    const aSum = aHigh * 1e6 + aLow * 1e3 + aUnknown
    const bSum = bHigh * 1e6 + bLow * 1e3 + bUnknown

    return bSum - aSum
  })

  const rows = sorted.map(({ projectId, chainEntry }) => {
    const { chainName, severityCounts: s } = chainEntry
    return [
      projectId,
      chainName,
      s.high === 0 ? '' : s.high.toString(),
      s.low === 0 ? '' : s.low.toString(),
      s.unknown === 0 ? '' : s.unknown.toString(),
    ]
  })

  return formatAsAsciiTable(headers, rows)
}

function flattenReminders(
  reminders: Record<string, DailyReminderChainEntry[]>,
): {
  projectId: string
  chainEntry: DailyReminderChainEntry
}[] {
  const entries: {
    projectId: string
    chainEntry: DailyReminderChainEntry
  }[] = []

  Object.entries(reminders).forEach(([key, values]) => {
    values.forEach((chainEntry) => {
      entries.push({ projectId: key, chainEntry })
    })
  })

  return entries
}

export async function generateTemplatizedStatus(): Promise<string> {
  const ps = new ProjectService()
  const scaling = await ps.getProjects({
    select: ['scalingInfo', 'discoveryInfo'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  const stacks: ProjectScalingStack[] = [
    ...new Set(
      scaling
        .flatMap((p) => p.scalingInfo.stacks)
        .filter((p) => p !== undefined),
    ),
  ]

  const entries: {
    stack: string
    projectCount: number
    fullyTemplatizedCount: number
  }[] = []

  for (const stack of stacks) {
    const isFullyTemplatized = scaling
      .filter((p) => p.scalingInfo.stacks?.includes(stack))
      .map((p) => p.discoveryInfo.isDiscoDriven)

    const fullyTemplatizedCount = isFullyTemplatized.filter((t) => t).length
    entries.push({
      stack,
      projectCount: isFullyTemplatized.length,
      fullyTemplatizedCount,
    })
  }

  const headers = ['Provider', 'Templatization status']
  const rows = []
  for (const e of entries.sort((a, b) => b.projectCount - a.projectCount)) {
    const percentage = (
      (e.fullyTemplatizedCount / e.projectCount) *
      100
    ).toFixed()
    const templatizationString = `${e.fullyTemplatizedCount}/${e.projectCount} (${percentage}%)`

    rows.push([e.stack, templatizationString])
  }

  const table = formatAsAsciiTable(headers, rows)

  return `\n### Templatized projects:\n\`\`\`${table}\`\`\`\n`
}

async function getDailyReminderHeader(
  timestamp: UnixTime,
  disabledChains: string[],
): Promise<string> {
  const templatizedProjectsString = await generateTemplatizedStatus()

  const disabledChainsMessage =
    disabledChains.length > 0
      ? `:warning: Disabled chains: ${disabledChains.map((c) => `\`${c}\``).join(', ')}\n`
      : ''

  return `# Daily bot report @ ${UnixTime.toYYYYMMDD(timestamp)}\n${disabledChainsMessage}${templatizedProjectsString}\n:x: Detected changes with following severities :x:`
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

export async function canTrackedTxsBeAffected(
  ps: ProjectService,
  projectId: string,
  diffs: DiscoveryDiff[],
): Promise<boolean> {
  if (diffs.length === 0) {
    return false
  }

  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['trackedTxsConfig'],
  })

  if (!project?.trackedTxsConfig || project.trackedTxsConfig.length === 0) {
    return false
  }

  const contractAddresses = diffs.map((diff) => diff.address.toString())

  return project.trackedTxsConfig.some((config) => {
    switch (config.params.formula) {
      case 'functionCall':
      case 'sharedBridge':
      case 'sharpSubmission':
        return contractAddresses.includes(config.params.address.toString())
      case 'transfer':
        return (
          (config.params.from
            ? contractAddresses.includes(config.params.from.toString())
            : false) || contractAddresses.includes(config.params.to.toString())
        )
    }
  })
}
