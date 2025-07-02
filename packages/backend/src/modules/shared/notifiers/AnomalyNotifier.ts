import type { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  RealTimeLivenessRecord,
} from '@l2beat/database'
import {
  type Block,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
  formatAsAsciiTable,
} from '@l2beat/shared-pure'
import type { DiscordWebhookClient } from '../../../peripherals/discord/DiscordWebhookClient'
import type { Clock } from '../../../tools/Clock'
import { TaskQueue } from '../../../tools/queue/TaskQueue'
import { formatDuration, formatSubtype } from './utils/format'

export class AnomalyNotifier {
  private logger: Logger
  private readonly notificationQueue: TaskQueue<void>

  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly discordClient: DiscordWebhookClient,
    private readonly db: Database,
  ) {
    this.logger = logger.for(this)
    this.notificationQueue = new TaskQueue<void>(
      async () => {
        await this.dailyReport()
      },
      this.logger.for('notificationQueue'),
      { metricsId: 'AnomalyNotifier' },
    )
  }

  start() {
    this.logger.info('Started')
    this.clock.onNewDay(() => this.notificationQueue.addIfEmpty())
  }

  async anomalyDetected(
    interval: number,
    z: number,
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    block: Block,
    latestRecord: RealTimeLivenessRecord,
    latestStat: AnomalyStatsRecord,
  ) {
    const message =
      `**${projectId}** stopped **${formatSubtype(subtype)}** - typically posts every **${formatDuration(latestStat.mean)}**, hasn't posted for **${formatDuration(interval)}**\n\n` +
      `- last registered transaction: [${latestRecord.txHash}](https://etherscan.io/tx/${latestRecord.txHash})\n` +
      `- detected at time: \`${block.timestamp}\`\n` +
      `- detected on block: \`${block.number}\`\n` +
      `- interval: \`${formatDuration(interval)}\`\n` +
      `- avg interval: \`${formatDuration(latestStat.mean)}\`\n` +
      `- z-score: \`${z}\` (interval: \`${interval}\`, mean: \`${latestStat.mean}\`, stddev: \`${latestStat.stdDev}\`)`

    await this.sendDiscordNotification(message)
  }

  async anomalyRecovered(
    duration: number,
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    block: Block,
    latestRecord: RealTimeLivenessRecord,
  ) {
    const message =
      `**${projectId}** recovered from **${formatSubtype(subtype)}** anomaly that lasted for **${formatDuration(duration)}**\n\n` +
      `- last registered transaction: [${latestRecord.txHash}](https://etherscan.io/tx/${latestRecord.txHash})\n` +
      `- recovered at time: \`${block.timestamp}\`\n` +
      `- recovered on block: \`${block.number}\`\n` +
      `- duration: \`${formatDuration(duration)}\``

    await this.sendDiscordNotification(message)
  }

  async dailyReport() {
    this.logger.info('Sending daily report')

    const ongoingAnomalies =
      await this.db.realTimeAnomalies.getOngoingAnomalies()

    const now = UnixTime.now()
    const date = UnixTime.toYYYYMMDD(UnixTime.now())

    const headers = ['Duration', 'ProjectId', 'Subtype', 'Status']

    const rows = ongoingAnomalies
      .map((anomaly) => ({
        duration: now - anomaly.start,
        ...anomaly,
      }))
      .sort((a, b) => b.duration - a.duration)
      .map((anomaly) => [
        formatDuration(anomaly.duration),
        anomaly.projectId,
        anomaly.subtype,
        anomaly.status,
      ])

    const table = formatAsAsciiTable(headers, rows)
    await this.sendDiscordNotification(
      `# Daily report @ ${date}\n### Ongoing anomalies:\n\`\`\`${table}\`\`\``,
    )
  }

  async sendDiscordNotification(message: string) {
    if (!this.discordClient) {
      return
    }

    try {
      await this.discordClient.sendMessage(message)
    } catch (error) {
      this.logger.error('Failed to send Discord notification', {
        error,
      })
    }
  }
}
