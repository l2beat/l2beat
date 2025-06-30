import type { Logger } from '@l2beat/backend-tools'
import type { Database, RealTimeAnomalyRecord } from '@l2beat/database'
import type { RealTimeLivenessRecord } from '@l2beat/database/dist/other/real-time-liveness/entity'
import type {
  TrackedTxFunctionCallConfig,
  TrackedTxLivenessConfig,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import {
  assert,
  type Block,
  type Log,
  type ProjectId,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import type { Config, TrackedTxsConfig } from '../../../config/Config'
import type { DiscordWebhookClient } from '../../../peripherals/discord/DiscordWebhookClient'
import { isChainIdMatching } from '../../tracked-txs/utils/isChainIdMatching'
import { isProgramHashProven } from '../../tracked-txs/utils/isProgramHashProven'
import type { BlockProcessor } from '../types'
import { formatDuration, formatSubtype } from '../utils/format'

export class RealTimeLivenessProcessor implements BlockProcessor {
  private logger: Logger
  private transfers: (TrackedTxLivenessConfig & {
    params: TrackedTxTransferConfig
  })[] = []
  private functionCalls: (TrackedTxLivenessConfig & {
    params: TrackedTxFunctionCallConfig
  })[] = []
  private sharpSubmissions: (TrackedTxLivenessConfig & {
    params: TrackedTxSharpSubmissionConfig
  })[] = []
  private sharedBridges: (TrackedTxLivenessConfig & {
    params: TrackedTxSharedBridgeConfig
  })[] = []

  constructor(
    config: Config,
    logger: Logger,
    private readonly db: Database,
    private readonly discordClient?: DiscordWebhookClient,
  ) {
    this.logger = logger.for(this)

    assert(config.trackedTxsConfig, 'TrackedTxsConfig is required')

    this.mapConfigurations(config.trackedTxsConfig)
  }

  async processBlock(block: Block, logs: Log[]): Promise<void> {
    await this.matchLivenessTransactions(block, logs)
    await this.checkForAnomalies(block)
  }

  async matchLivenessTransactions(block: Block, logs: Log[]) {
    const records: RealTimeLivenessRecord[] = []

    for (const tx of block.transactions) {
      if (!tx.data || !tx.to || !tx.hash) continue

      const selector = tx.data.slice(0, 10)
      const matchingTransfers = this.transfers.filter(
        (c) =>
          c.params.from.toLowerCase() === tx.from?.toLowerCase() &&
          c.params.to.toLowerCase() === tx.to?.toLowerCase(),
      )

      const matchingCalls = this.functionCalls.filter(
        (c) =>
          c.params.selector === selector &&
          c.params.address.toLowerCase() === tx.to?.toLowerCase(),
      )

      const matchingSubmissions = this.sharpSubmissions.filter(
        (c) =>
          c.params.selector === selector &&
          c.params.address.toLowerCase() === tx.to?.toLowerCase(),
      )

      const matchingSharedBridgeCalls = this.sharedBridges.filter(
        (c) =>
          c.params.selector === selector &&
          c.params.address.toLowerCase() === tx.to?.toLowerCase(),
      )

      const filteredSubmissions = matchingSubmissions.filter((c) =>
        isProgramHashProven(
          { input: tx.data as string },
          c.params.programHashes,
        ),
      )

      const filteredSharedBridgeCalls = matchingSharedBridgeCalls.filter((c) =>
        isChainIdMatching(tx.data as string, c.params),
      )

      const results = [
        ...matchingTransfers,
        ...matchingCalls,
        ...filteredSubmissions,
        ...filteredSharedBridgeCalls,
      ].map((config) => ({
        timestamp: block.timestamp,
        blockNumber: block.number,
        txHash: tx.hash as string,
        configurationId: config.id,
      }))

      records.push(...results)
    }

    for (const log of logs) {
      // for now we only support function calls in logs
      const matchingCalls = this.functionCalls.filter(
        (c) =>
          c.params.address.toLowerCase() === log.address.toLowerCase() &&
          c.params.topics?.some((topic) => log.topics.includes(topic)),
      )

      const results = matchingCalls
        .map((config) => ({
          timestamp: block.timestamp,
          blockNumber: block.number,
          txHash: log.transactionHash as string,
          configurationId: config.id,
        }))
        .filter(
          (result) =>
            !records.some(
              (r) =>
                r.txHash === result.txHash &&
                r.configurationId === result.configurationId,
            ),
        )

      records.push(...results)
    }

    this.logger.info(
      `Created ${records.length} liveness records for block ${block.number}`,
      { blockNumber: block.number, count: records.length },
    )

    await this.db.realTimeLiveness.upsertMany(records)
  }

  async checkForAnomalies(block: Block) {
    const latestStats = await this.db.anomalyStats.getLatestStats()
    const latestRecords = await this.db.realTimeLiveness.getLatestRecords()
    const ongoingAnomalies =
      await this.db.realTimeAnomalies.getOngoingAnomalies()

    const records: RealTimeAnomalyRecord[] = []
    const configGroups = this.groupConfigurations()

    for (const group of configGroups.values()) {
      const groupRecords = latestRecords
        .filter((r) => group.configurationIds.includes(r.configurationId))
        .sort((a, b) => b.timestamp - a.timestamp)
      const latestRecord =
        groupRecords.length === 0 ? undefined : groupRecords[0]

      const latestStat = latestStats.find(
        (s) => s.projectId === group.projectId && s.subtype === group.subtype,
      )

      const ongoingAnomaly = ongoingAnomalies.find(
        (a) => a.projectId === group.projectId && a.subtype === group.subtype,
      )

      if (!latestRecord || !latestStat) {
        continue
      }

      const interval = block.timestamp - latestRecord.timestamp
      const z = (interval - latestStat.mean) / latestStat.stdDev
      const isAnomaly = z >= 15 && interval > latestStat.mean

      if (isAnomaly) {
        if (ongoingAnomaly) {
          this.logger.info(`Ongoing anomaly detected`, {
            projectId: group.projectId,
            subtype: group.subtype,
            duration: interval,
            blockNumber: block.number,
          })
          continue
        }

        this.logger.info(`New anomaly detected`, {
          projectId: group.projectId,
          subtype: group.subtype,
          duration: interval,
          blockNumber: block.number,
        })

        const message =
          `**${group.projectId}** stopped posting **${formatSubtype(group.subtype)}** - typically posts every **${formatDuration(latestStat.mean)}**, hasn't posted for **${formatDuration(interval)}**\n\n` +
          `- last registered transaction: [${latestRecord.txHash}](https://etherscan.io/tx/${latestRecord.txHash})\n` +
          `- detected at time: \`${block.timestamp}\`\n` +
          `- detected on block: \`${block.number}\`\n` +
          `- interval: \`${formatDuration(interval)}\`\n` +
          `- avg interval: \`${formatDuration(latestStat.mean)}\`\n` +
          `- z-score: \`${z}\` (interval: \`${interval}\`, mean: \`${latestStat.mean}\`, stddev: \`${latestStat.stdDev}\`)`

        await this.sendDiscordNotification(message)

        const newAnomaly: RealTimeAnomalyRecord = {
          start: latestRecord.timestamp,
          projectId: group.projectId,
          subtype: group.subtype,
          status: 'ongoing',
        }

        records.push(newAnomaly)
      } else {
        if (!ongoingAnomaly) {
          continue
        }

        this.logger.info(`Recovered from anomaly`, {
          projectId: group.projectId,
          subtype: group.subtype,
          blockNumber: block.number,
        })

        const message =
          `**${group.projectId}** recovered from **${formatSubtype(group.subtype)}** anomaly that lasted for **${formatDuration(latestRecord.timestamp - ongoingAnomaly.start)}**\n\n` +
          `- last registered transaction: [${latestRecord.txHash}](https://etherscan.io/tx/${latestRecord.txHash})\n` +
          `- recovered at time: \`${block.timestamp}\`\n` +
          `- recovered on block: \`${block.number}\`\n` +
          `- duration: \`${formatDuration(latestRecord.timestamp - ongoingAnomaly.start)}\``

        await this.sendDiscordNotification(message)

        const recoveredAnomaly: RealTimeAnomalyRecord = {
          ...ongoingAnomaly,
          status: 'recovered',
          end: latestRecord.timestamp,
        }

        records.push(recoveredAnomaly)
      }
    }

    if (records.length === 0) {
      this.logger.info('No anomalies detected')
      return
    }

    await this.db.realTimeAnomalies.upsertMany(records)
  }

  private groupConfigurations(): Map<
    string,
    {
      projectId: ProjectId
      subtype: TrackedTxsConfigSubtype
      configurationIds: string[]
    }
  > {
    const configs: TrackedTxLivenessConfig[] = [
      ...this.transfers,
      ...this.functionCalls,
      ...this.sharpSubmissions,
      ...this.sharedBridges,
    ]

    const configGroups = new Map<
      string,
      {
        projectId: ProjectId
        subtype: TrackedTxsConfigSubtype
        configurationIds: string[]
      }
    >()

    for (const config of configs) {
      const key = `${config.projectId}-${config.subtype}`
      if (!configGroups.has(key)) {
        configGroups.set(key, {
          projectId: config.projectId,
          subtype: config.subtype,
          configurationIds: [],
        })
      }
      configGroups.get(key)?.configurationIds.push(config.id)
    }

    return configGroups
  }

  private mapConfigurations(trackedTxsConfig: TrackedTxsConfig) {
    const livenesConfigurations = trackedTxsConfig.projects
      .filter((project) => !project.isArchived)
      .flatMap((project) => project.configurations)
      .filter((config) => config.type === 'liveness')

    this.transfers = livenesConfigurations.filter(
      (
        c,
      ): c is TrackedTxLivenessConfig & {
        params: TrackedTxTransferConfig
      } => c.params.formula === 'transfer',
    )

    this.functionCalls = livenesConfigurations.filter(
      (
        c,
      ): c is TrackedTxLivenessConfig & {
        params: TrackedTxFunctionCallConfig
      } => c.params.formula === 'functionCall',
    )

    this.sharpSubmissions = livenesConfigurations.filter(
      (
        c,
      ): c is TrackedTxLivenessConfig & {
        params: TrackedTxSharpSubmissionConfig
      } => c.params.formula === 'sharpSubmission',
    )

    this.sharedBridges = livenesConfigurations.filter(
      (
        c,
      ): c is TrackedTxLivenessConfig & {
        params: TrackedTxSharedBridgeConfig
      } => c.params.formula === 'sharedBridge',
    )
  }

  private async sendDiscordNotification(message: string) {
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
