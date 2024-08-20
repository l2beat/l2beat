import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { BlobClient } from '@l2beat/shared'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import { ChannelBank } from './ChannelBank'
import { getRollupData } from './blobToData'
import { SpanBatchDecoderOpts, decodeSpanBatch } from './decodeSpanBatch'
import { getFrames } from './getFrames'
import { getBatchFromChannel } from './utils'

export class OpStackFinalityAnalyzer extends BaseAnalyzer {
  private readonly channelBank: ChannelBank

  constructor(
    private readonly blobClient: BlobClient,
    private readonly logger: Logger,
    provider: RpcClient,
    db: Database,
    projectId: ProjectId,
    private readonly opts: SpanBatchDecoderOpts,
  ) {
    super(provider, db, projectId)
    this.logger = logger.for(this).tag(projectId.toString())
    this.channelBank = new ChannelBank(projectId, this.logger)
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    try {
      this.logger.debug('Getting finality', { transaction })
      const l1Timestamp = transaction.timestamp
      // get blobs relevant to the transaction
      const { blobs, blockNumber } = await this.blobClient.getRelevantBlobs(
        transaction.txHash,
      )
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
        // We only support span batches
        const blocksWithTimestamps = decodeSpanBatch(encodedBatch, this.opts)
        assert(blocksWithTimestamps.length > 0, 'No blocks in the batch')

        const delays = blocksWithTimestamps.map(
          (block) => l1Timestamp.toNumber() - block.timestamp,
        )
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
