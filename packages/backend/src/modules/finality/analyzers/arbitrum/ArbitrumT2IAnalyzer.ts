import { Logger } from '@l2beat/backend-tools'
import { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { BlobClient } from '@l2beat/shared'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { calculateDelaysFromSegments } from './calculateDelaysFromSegments'
import { getSegments } from './getSegments'

export class ArbitrumT2IAnalyzer extends BaseAnalyzer {
  constructor(
    private readonly blobClient: BlobClient,
    private readonly logger: Logger,
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
  ) {
    super(provider, db, projectId)
    this.logger = logger.for(this).tag(projectId.toString())
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    this.logger.debug('Getting finality', { transaction })
    // get blobs relevant to the transaction
    const { blobs } = await this.blobClient.getRelevantBlobs(transaction.txHash)

    const segments = getSegments(blobs)
    // https://linear.app/l2beat/issue/L2B-4752/refactor-finalityindexer-logic-to-allow-analyzers-different
    // TODO: refactor FinalityIndexer to enable calculating finality
    // more accurately
    return calculateDelaysFromSegments(segments)
  }
}
