import { Logger, UnixTime } from '@l2beat/shared'

import { Channel, DiscordClient } from '../../peripherals/discord/DiscordClient'
import { DiscoveryDiff } from './output/diffDiscovery'
import { diffToMessages } from './output/diffToMessages'
import { isNineAM } from './utils/isNineAM'

export class NotificationManager {
  constructor(
    private readonly discordClient: DiscordClient | undefined,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async handleDiff(name: string, dependents: string[], diff: DiscoveryDiff[]) {
    const messages = diffToMessages(name, dependents, diff)
    await this.notify(messages, 'INTERNAL')
    this.logger.info('Changes detected sent [INTERNAL]', {
      name,
      amount: diff.map((d) => (d.diff ?? []).length).reduce((a, b) => a + b, 0),
    })

    const withoutErrors = diff.filter((d) =>
      d.diff?.every((dd) => dd.key !== 'errors'),
    )
    if (withoutErrors.length === 0) {
      return
    }
    const messagesWithoutErrors = diffToMessages(
      name,
      dependents,
      withoutErrors,
    )
    await this.notify(messagesWithoutErrors, 'PUBLIC')
    this.logger.info('Changes detected sent [PUBLIC]', {
      name,
      amount: withoutErrors
        .map((d) => (d.diff ?? []).length)
        .reduce((a, b) => a + b, 0),
    })
  }

  async handleUnresolved(notUpdatedProjects: string[], timestamp: UnixTime) {
    if (!isNineAM(timestamp, 'CET')) {
      return
    }

    await this.notify(
      getDailyReminderMessage(notUpdatedProjects, timestamp),
      'INTERNAL',
    )
    this.logger.info('Daily reminder sent', {
      projects: notUpdatedProjects,
    })
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
        (e) => this.logger.error(e),
      )
    }
  }

  async handleStart() {
    await this.notify('UpdateMonitor started.', 'INTERNAL')
    await this.notify('UpdateMonitor started.', 'PUBLIC')
    this.logger.info('Initial notifications sent')
  }
}

function getDailyReminderMessage(projects: string[], timestamp: UnixTime) {
  const dailyReportMessage = `\`\`\`Daily bot report @ ${timestamp.toYYYYMMDD()}\`\`\`\n`
  if (projects.length > 0) {
    return `${dailyReportMessage}${projects
      .map((p) => `:x: ${p}`)
      .join('\n\n')}`
  }

  return `${dailyReportMessage}:white_check_mark: everything is up to date`
}
