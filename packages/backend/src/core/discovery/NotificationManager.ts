import { Logger, UnixTime } from '@l2beat/shared'

import { Channel, DiscordClient } from '../../peripherals/discord/DiscordClient'

export class NotificationManager {
  constructor(
    private readonly discordClient: DiscordClient | undefined,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async notUpdatedProjects(notUpdatedProjects: string[], timestamp: UnixTime) {
    if (!isNineAM(timestamp, 'CET')) {
      return
    }

    this.logger.info('Sending daily reminder', {
      projects: notUpdatedProjects,
    })
    await this.notify(getDailyReminderMessage(notUpdatedProjects, timestamp), {
      internalOnly: true,
    })
  }

  async notify(
    messages: string | string[],
    options?: { internalOnly: boolean },
  ) {
    if (!this.discordClient) {
      // TODO: maybe only once? rethink
      this.logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
      return
    }

    const arrayMessages = Array.isArray(messages) ? messages : [messages]
    for (const message of arrayMessages) {
      const channels: Channel[] = options?.internalOnly
        ? ['INTERNAL']
        : ['PUBLIC', 'INTERNAL']

      for (const channel of channels) {
        await this.discordClient.sendMessage(message, channel).then(
          () => this.logger.info('Notification to Discord has been sent'),
          (e) => this.logger.error(e),
        )
      }
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

export function isNineAM(timestamp: UnixTime, timezone: 'CET' | 'UTC') {
  const offset = timezone === 'CET' ? 3 : 0
  const hour = 9 - offset

  return timestamp
    .toStartOf('hour')
    .equals(timestamp.toStartOf('day').add(hour, 'hours'))
}
