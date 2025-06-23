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
import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type { Config } from '../../../config'
import type { TrackedTxsConfig } from '../../../config/Config'
import { isChainIdMatching } from '../../tracked-txs/utils/isChainIdMatching'
import { isProgramHashProven } from '../../tracked-txs/utils/isProgramHashProven'
import type { BlockProcessor } from '../types'

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
  ) {
    this.logger = logger.for(this)

    assert(config.trackedTxsConfig, 'TrackedTxsConfig is required')

    this.mapConfigurations(config.trackedTxsConfig)
  }

  async processBlock(block: Block): Promise<void> {
    await this.matchLivenessTransactions(block)
    await this.checkForAnomalies()
  }

  async matchLivenessTransactions(block: Block) {
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

    this.logger.info(
      `Created ${records.length} liveness records for block ${block.number}`,
      { blockNumber: block.number, count: records.length },
    )

    await this.db.realTimeLiveness.insertMany(records)
  }

  async checkForAnomalies() {
    const latestStats = await this.db.anomalyStats.getLatestStats()
    const latestRecords = await this.db.realTimeLiveness.getLatestRecords()
    const ongoingAnomalies =
      await this.db.realTimeAnomalies.getOngoingAnomalies()

    const configs: TrackedTxLivenessConfig[] = [
      ...this.transfers,
      ...this.functionCalls,
      ...this.sharpSubmissions,
      ...this.sharedBridges,
    ]

    const records: RealTimeAnomalyRecord[] = []

    for (const config of configs) {
      const latestRecord = latestRecords.find(
        (r) => r.configurationId === config.id,
      )

      const latestStat = latestStats.find(
        (s) => s.projectId === config.projectId && s.subtype === config.subtype,
      )

      const ongoingAnomaly = ongoingAnomalies.find(
        (a) => a.projectId === config.projectId && a.subtype === config.subtype,
      )

      if (!latestRecord || !latestStat) {
        continue
      }

      const interval = UnixTime.now() - latestRecord.timestamp
      const z = (interval - latestStat.mean) / latestStat.stdDev
      const isAnomaly = z >= 15 && interval > latestStat.mean

      if (isAnomaly) {
        if (ongoingAnomaly) {
          this.logger.info(
            `Ongoing anomaly detected for configuration ${config.id}`,
            {
              projectId: config.projectId,
              subtype: config.subtype,
              duration: interval,
            },
          )
          continue
        }

        this.logger.info(
          `New anomaly detected for configuration ${config.id}`,
          {
            projectId: config.projectId,
            subtype: config.subtype,
            duration: interval,
          },
        )

        const newAnomaly: RealTimeAnomalyRecord = {
          start: latestRecord.timestamp,
          projectId: config.projectId,
          subtype: config.subtype,
          status: 'ongoing',
        }

        records.push(newAnomaly)
      } else {
        if (!ongoingAnomaly) {
          continue
        }

        this.logger.info(
          `Configuration ${config.id} has recovered from anomaly`,
          {
            projectId: config.projectId,
            subtype: config.subtype,
          },
        )

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

  private mapConfigurations(trackedTxsConfig: TrackedTxsConfig) {
    const livenesConfigurations = trackedTxsConfig.projects
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
}
