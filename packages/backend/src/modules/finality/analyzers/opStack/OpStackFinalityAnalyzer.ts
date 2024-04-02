import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { BlobClient } from '../../../../peripherals/blobclient/BlobClient'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import { getRollupData } from './blobToData'
import { ChannelBank } from './ChannelBank'
import { decodeSpanBatch, SpanBatchDecoderOpts } from './decodeSpanBatch'
import { getFrames } from './getFrames'
import { getBatchFromChannel } from './utils'

export class OpStackFinalityAnalyzer extends BaseAnalyzer {
  private readonly channelBank: ChannelBank

  constructor(
    private readonly blobClient: BlobClient,
    private readonly logger: Logger,
    provider: RpcClient,
    livenessRepository: LivenessRepository,
    projectId: ProjectId,
    private readonly opts: SpanBatchDecoderOpts,
  ) {
    super(provider, livenessRepository, projectId)
    this.logger = logger.for(this).tag(projectId.toString())
    this.channelBank = new ChannelBank(projectId, this.logger)
  }

  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    try {
      this.logger.debug('Getting finality', { transaction })
      const l1Timestamp = transaction.timestamp
      // get blobs relevant to the transaction
      const { relevantBlobs, blockNumber } =
        await this.blobClient.getRelevantBlobs(transaction.txHash)
      const rollupData = getRollupData(relevantBlobs)
      const frames = rollupData.map((ru) => getFrames(ru))
      const channel = this.channelBank.addFramesToChannel(frames, blockNumber)
      // no channel was closed in this tx, so no txs were finalized
      if (!channel) {
        return []
      }
      const assembledChannel = channel.assemble()
      const encodedBatch = await getBatchFromChannel(assembledChannel)
      // We only support span batches
      const blocksWithTimestamps = decodeSpanBatch(encodedBatch, this.opts)
      assert(blocksWithTimestamps.length > 0, 'No blocks in the batch')

      const delays = blocksWithTimestamps.map(
        (block) => l1Timestamp.toNumber() - block.timestamp,
      )

      return delays
    } catch (error) {
      this.logger.error('Error while getting finality', {
        transaction: transaction.txHash,
        error,
      })
      throw error
    }
  }
}
