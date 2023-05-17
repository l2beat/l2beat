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

  async changesDetected(
    name: string,
    dependents: string[],
    diff: DiscoveryDiff[],
  ) {
    const messages = diffToMessages(name, dependents, diff)
    await this.notify(messages, 'INTERNAL')

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
  }

  async notUpdatedProjects(notUpdatedProjects: string[], timestamp: UnixTime) {
    if (!isNineAM(timestamp, 'CET')) {
      return
    }

    this.logger.info('Sending daily reminder', {
      projects: notUpdatedProjects,
    })
    await this.notify(
      getDailyReminderMessage(notUpdatedProjects, timestamp),
      'INTERNAL',
    )
  }

  async notify(messages: string | string[], channel: Channel) {
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
        () => this.logger.info('Notification to Discord has been sent'),
        (e) => this.logger.error(e),
      )
    }
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
