import type { Logger } from '@l2beat/backend-tools'
import type { LivenessRecord } from '@l2beat/database'
import type {
  TrackedTxFunctionCallConfig,
  TrackedTxLivenessConfig,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import { assert, type Block } from '@l2beat/shared-pure'
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

  constructor(config: Config, logger: Logger) {
    this.logger = logger.for(this)

    assert(config.trackedTxsConfig, 'TrackedTxsConfig is required')

    this.mapConfigurations(config.trackedTxsConfig)
  }

  async processBlock(block: Block): Promise<void> {
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
        projectId: config.projectId,
        subtype: config.subtype,
        formula: config.params.formula,
      }))

      records.push(...results)
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
}
