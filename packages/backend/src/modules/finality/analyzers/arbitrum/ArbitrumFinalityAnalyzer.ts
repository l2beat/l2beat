import { Logger } from '@l2beat/backend-tools'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { BlobClient } from '../../../../peripherals/blobclient/BlobClient'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
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
    projectId: ProjectId,
  ) {
    super(provider, livenessRepository, projectId)
    this.logger = logger.for(this).tag(projectId.toString())
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    this.logger.debug('Getting finality', { transaction })
    const submissionTimestamp = transaction.timestamp
    // get blobs relevant to the transaction
    const { relevantBlobs } = await this.blobClient.getRelevantBlobs(
      transaction.txHash,
    )

    const segments = getSegments(relevantBlobs)
    const delays = calculateDelaysFromSegments(
      segments,
      submissionTimestamp.toNumber(),
    )
    // TODO: this should be better
    return [delays.minDelay, delays.avgDelay, delays.maxDelay]
  }
}
