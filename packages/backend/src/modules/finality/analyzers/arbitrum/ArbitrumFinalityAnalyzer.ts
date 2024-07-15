import { Logger } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { BlobClient } from '@l2beat/shared'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { IndexerConfigurationRepository } from '../../../../tools/uif/IndexerConfigurationRepository'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import { calculateDelaysFromSegments } from './calculateDelaysFromSegments'
import { getSegments } from './getSegments'

export class ArbitrumFinalityAnalyzer extends BaseAnalyzer {
  constructor(
    private readonly blobClient: BlobClient,
    private readonly logger: Logger,
    provider: RpcClient,
    livenessRepository: LivenessRepository,
    indexerConfigurationRepository: IndexerConfigurationRepository,
    projectId: ProjectId,
  ) {
    super(
      provider,
      livenessRepository,
      indexerConfigurationRepository,
      projectId,
    )
    this.logger = logger.for(this).tag(projectId.toString())
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    this.logger.debug('Getting finality', { transaction })
    const submissionTimestamp = transaction.timestamp
    // get blobs relevant to the transaction
    const { blobs } = await this.blobClient.getRelevantBlobs(transaction.txHash)

    const segments = getSegments(blobs)
    const delays = calculateDelaysFromSegments(
      segments,
      submissionTimestamp.toNumber(),
    )
    // https://linear.app/l2beat/issue/L2B-4752/refactor-finalityindexer-logic-to-allow-analyzers-different
    // TODO: refactor FinalityIndexer to enable calculating finality
    // more accurately
    return [delays.minDelay, delays.avgDelay, delays.maxDelay]
  }
}
