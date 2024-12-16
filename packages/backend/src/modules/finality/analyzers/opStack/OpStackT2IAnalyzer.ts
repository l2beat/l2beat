import { Logger } from '@l2beat/backend-tools'
import { assert, ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { BlobProvider, RpcClient } from '@l2beat/shared'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { ChannelBank } from './ChannelBank'
import { getRollupData } from './blobToData'
import { SpanBatchDecoderOpts, decodeBatch } from './decodeBatch'
import { getFrames } from './getFrames'
import { getBatchFromChannel } from './utils'

export class OpStackT2IAnalyzer extends BaseAnalyzer {
  private readonly channelBank: ChannelBank

  constructor(
    private readonly blobProvider: BlobProvider,
    private readonly logger: Logger,
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly opts: SpanBatchDecoderOpts,
  ) {
    super(provider, db, projectId)
    this.logger = logger.for(this).tag({
      tag: projectId,
      project: projectId,
    })
    this.channelBank = new ChannelBank(projectId, this.logger)
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(
    _previousTransactions: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    try {
      this.logger.debug('Getting finality', { transaction })
      // get blobs relevant to the transaction
      const { blobs, blockNumber } = await this.blobProvider.getRelevantBlobs(
        transaction.txHash,
      )
      if (blobs.length === 0) {
        return []
      }
      const rollupData = getRollupData(blobs)
      const frames = rollupData.map((ru) => getFrames(ru))
      const channel = this.channelBank.addFramesToChannel(frames, blockNumber)
      // no channel was closed in this tx, so no txs were finalized
      if (!channel) {
        return []
      }
      const assembledChannel = channel.assemble()
      const encodedBatches = await getBatchFromChannel(assembledChannel)

      const result = []
      for (const encodedBatch of encodedBatches) {
        const blocksWithTimestamps = decodeBatch(encodedBatch, this.opts)
        assert(blocksWithTimestamps.length > 0, 'No blocks in the batch')

        const delays = blocksWithTimestamps.map((block) => ({
          blockNumber: block.blockNumber,
          timestamp: block.timestamp,
        }))
        result.push(...delays)
      }

      return result
    } catch (error) {
      this.logger.error('Error while getting finality', {
        transaction: transaction.txHash,
        error,
      })
      throw error
    }
  }
}
