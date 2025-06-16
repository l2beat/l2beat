import type { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  LivenessRecord,
} from '@l2beat/database'
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
    try {
      const records = await this.createRecords(block)

      this.logger.info(
        `Processing block ${block.number} with ${records.length} liveness records`,
      )

      await this.db.realTimeLiveness.insertMany(records)

      const latestStats = await this.db.anomalyStats.getLatestStats()
      const latestRecords = await this.db.realTimeLiveness.getLatestRecords()

      await this.checkForAnomalies(latestRecords, latestStats)
    } catch (error) {
      this.logger.error(
        `Failed to process block ${block.number}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
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

  private createRecords(block: Block): LivenessRecord[] {
    const records: LivenessRecord[] = []

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

    return records
  }

  private checkForAnomalies(
    latestRecords: LivenessRecord[],
    latestStats: AnomalyStatsRecord[],
  ) {
    const configs: TrackedTxLivenessConfig[] = [
      ...this.transfers,
      ...this.functionCalls,
      ...this.sharpSubmissions,
      ...this.sharedBridges,
    ]

    for (const config of configs) {
      const latestRecord = latestRecords.find(
        (r) => r.configurationId === config.id,
      )

      const latestStat = latestStats.find(
        (s) => s.projectId === config.projectId && s.subtype === config.subtype,
      )

      if (!latestRecord || !latestStat) {
        continue
      }

      const interval = UnixTime.now() - latestRecord.timestamp
      const z = (interval - latestStat.mean) / latestStat.stdDev

      if (z >= 15 && interval > latestStat.mean) {
        this.logger.info(
          `Anomaly detected for configuration ${config.id} with z-score ${z}`,
          {
            projectId: config.projectId,
            subtype: config.subtype,
            timestamp: latestRecord.timestamp,
            duration: interval,
            mean: latestStat.mean,
            stdDev: latestStat.stdDev,
          },
        )
      }
    }
  }
}
