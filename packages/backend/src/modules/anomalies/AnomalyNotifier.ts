import type { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  NotificationRecord,
  RealTimeAnomalyRecord,
  RealTimeLivenessRecord,
} from '@l2beat/database'
import type { TrackedTxLivenessConfig } from '@l2beat/shared'
import {
  type Block,
  ChainSpecificAddress,
  formatAsAsciiTable,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import type { TrackedTxProject, TrackedTxsConfig } from '../../config/Config'
import type { DiscordWebhookClient } from '../../peripherals/discord/DiscordWebhookClient'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { formatDuration, formatSubtype } from './format'

export type AnomalyNotificationType =
  | 'anomaly-detected'
  | 'anomaly-ongoing'
  | 'anomaly-recovered'

export class AnomalyNotifier {
  private logger: Logger
  private readonly notificationQueue: TaskQueue<void>
  private trackedTxsConfigsMap: Map<
    string,
    TrackedTxLivenessConfig['params'][]
  > = new Map()

  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly discordClient: DiscordWebhookClient,
    private readonly db: Database,
    private readonly minDuration: number,
    private readonly trackedTxsConfig: TrackedTxsConfig,
  ) {
    this.logger = logger.for(this)
    this.notificationQueue = new TaskQueue<void>(
      async () => {
        await this.dailyReport()
      },
      this.logger.for('notificationQueue'),
      { metricsId: 'AnomalyNotifier' },
    )

    this.mapTrackedTxsConfigs(trackedTxsConfig.projects)
  }

  start() {
    this.logger.info('Started')
    this.clock.onNewDay(() => this.notificationQueue.addIfEmpty())
  }

  async anomalyDetected(
    newAnomaly: RealTimeAnomalyRecord,
    interval: number,
    z: number,
    block: Block,
    latestRecord: RealTimeLivenessRecord,
    latestStat: AnomalyStatsRecord,
  ) {
    if (interval < this.minDuration && z < 100) {
      return
    }

    const hasImplementationChange = await this.checkIfHasImplementationChange(
      newAnomaly.projectId,
      newAnomaly.subtype,
    )

    const message =
      `**${newAnomaly.projectId}** stopped **${formatSubtype(newAnomaly.subtype)}** - typically posts every **${formatDuration(latestStat.mean)}**, hasn't posted for **${formatDuration(interval)}**\n\n` +
      (hasImplementationChange
        ? 'There are unhandled implementation changes.\n\n'
        : '') +
      `- last registered transaction: [${latestRecord.txHash}](https://etherscan.io/tx/${latestRecord.txHash})\n` +
      `- detected at time: \`${block.timestamp}\`\n` +
      `- detected on block: \`${block.number}\`\n` +
      `- interval: \`${formatDuration(interval)}\`\n` +
      `- avg interval: \`${formatDuration(latestStat.mean)}\`\n` +
      `- z-score: \`${z}\` (interval: \`${interval}\`, mean: \`${latestStat.mean}\`, stddev: \`${latestStat.stdDev}\`)\n\n` +
      `Run \`pnpm anomalies --approve ${newAnomaly.projectId}-${newAnomaly.subtype}\` to approve the anomaly`

    const id = await this.sendDiscordNotification(message)

    if (!id) return

    await this.saveNotification(
      id,
      'anomaly-detected',
      this.generateRelatedEntityId(newAnomaly),
      block.timestamp,
    )
  }

  async anomalyOngoing(
    ongoingAnomaly: RealTimeAnomalyRecord,
    interval: number,
    z: number,
    block: Block,
    latestRecord: RealTimeLivenessRecord,
    latestStat: AnomalyStatsRecord,
  ) {
    // send only if the duration is over minDuration OR z-score is over 100 and we haven't sent a notification yet
    if (interval < this.minDuration && z < 100) {
      return
    }

    const relatedEntityId = this.generateRelatedEntityId(ongoingAnomaly)
    const notifications =
      await this.db.notifications.getByRelatedEntityId(relatedEntityId)

    if (notifications.length > 0) {
      return
    }

    this.anomalyDetected(
      ongoingAnomaly,
      interval,
      z,
      block,
      latestRecord,
      latestStat,
    )
  }

  async anomalyRecovered(
    ongoingAnomaly: RealTimeAnomalyRecord,
    duration: number,
    block: Block,
    latestRecord: RealTimeLivenessRecord,
  ) {
    const relatedEntityId = this.generateRelatedEntityId(ongoingAnomaly)
    const notifications =
      await this.db.notifications.getByRelatedEntityId(relatedEntityId)

    // we only want to send notification if we previously sent a notification about the detected anomaly
    if (notifications.length === 0) {
      return
    }

    const message =
      `**${ongoingAnomaly.projectId}** recovered from **${formatSubtype(ongoingAnomaly.subtype)}** anomaly that lasted for **${formatDuration(duration)}**\n\n` +
      `- last registered transaction: [${latestRecord.txHash}](https://etherscan.io/tx/${latestRecord.txHash})\n` +
      `- recovered at time: \`${block.timestamp}\`\n` +
      `- recovered on block: \`${block.number}\`\n` +
      `- duration: \`${formatDuration(duration)}\``

    const id = await this.sendDiscordNotification(message)

    if (!id) return

    await this.saveNotification(
      id,
      'anomaly-recovered',
      this.generateRelatedEntityId(ongoingAnomaly),
      block.timestamp,
    )
  }

  async dailyReport() {
    this.logger.info('Sending daily report')

    const ongoingAnomalies =
      await this.db.realTimeAnomalies.getOngoingAnomalies()

    const now = UnixTime.now()
    const date = UnixTime.toYYYYMMDD(UnixTime.now())

    const headers = ['Duration', 'ProjectId', 'Subtype', 'Approval']

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
        anomaly.isApproved ? 'approved' : 'not approved',
      ])

    const table = formatAsAsciiTable(headers, rows)
    await this.sendDiscordNotification(
      `# Daily report @ ${date}\n### Ongoing anomalies:\n\`\`\`${table}\`\`\``,
    )
  }

  async sendDiscordNotification(message: string): Promise<string | undefined> {
    try {
      return await this.discordClient.sendMessage(message)
    } catch (error) {
      this.logger.error('Failed to send Discord notification', {
        error,
      })
    }
  }

  async saveNotification(
    id: string,
    type: AnomalyNotificationType,
    relatedEntityId: string,
    timestamp: UnixTime,
  ) {
    const notification: NotificationRecord = {
      id,
      channel: 'discord',
      type,
      relatedEntityId,
      timestamp,
    }

    await this.db.notifications.insertMany([notification])
  }

  private mapTrackedTxsConfigs(projects: TrackedTxProject[]) {
    for (const project of projects) {
      for (const configuration of project.configurations) {
        if (configuration.type === 'liveness') {
          const current = this.trackedTxsConfigsMap.get(
            `${project.id}-${configuration.subtype}`,
          )
          if (current) {
            current.push(configuration.params)
          } else {
            this.trackedTxsConfigsMap.set(
              `${project.id}-${configuration.subtype}`,
              [configuration.params],
            )
          }
        }
      }
    }
  }

  private async checkIfHasImplementationChange(
    projectId: string,
    subtype: TrackedTxsConfigSubtype,
  ) {
    const updateDiffs = await this.db.updateDiff.getAll()
    const implementationChanges = updateDiffs
      .filter(
        (diff) =>
          diff.projectId === projectId &&
          diff.type === 'implementationChange' &&
          ChainSpecificAddress.chain(ChainSpecificAddress(diff.address)) ===
            'eth',
      )
      .map((diff) =>
        ChainSpecificAddress.address(ChainSpecificAddress(diff.address)),
      )

    return this.trackedTxsConfigsMap
      .get(`${projectId}-${subtype}`)
      ?.some((config) => {
        switch (config.formula) {
          case 'functionCall':
          case 'sharedBridge':
          case 'sharpSubmission':
            return implementationChanges.includes(config.address)
          case 'transfer':
            return (
              (config.from
                ? implementationChanges.includes(config.from)
                : false) || implementationChanges.includes(config.to)
            )
        }
      })
  }

  generateRelatedEntityId(anomaly: RealTimeAnomalyRecord): string {
    return `${anomaly.projectId}-${anomaly.subtype}-${anomaly.start}`
  }
}
