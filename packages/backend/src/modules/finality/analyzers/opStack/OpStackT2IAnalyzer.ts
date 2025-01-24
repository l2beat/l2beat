import type { Logger } from '@l2beat/backend-tools'
import {
  assert,
  type ProjectId,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'

import type { Database } from '@l2beat/database'
import type { BlobProvider, EVMTransaction, RpcClient } from '@l2beat/shared'
import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'
import { BaseAnalyzer } from '../types/BaseAnalyzer'
import type { L2Block, Transaction } from '../types/BaseAnalyzer'
import { ChannelBank } from './ChannelBank'
import { getRollupData } from './blobToData'
import { type SpanBatchDecoderOpts, decodeBatch } from './decodeBatch'
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
    private readonly opts: Omit<SpanBatchDecoderOpts, 'blockOffset'>,
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

      const tx = await this.provider.getTransaction(transaction.txHash)
      assert(tx.blockNumber, `Tx ${tx}: No pending txs allowed`)

      const rollupData = await this.getRollupData(tx)
      const frames = rollupData.map((ru) => getFrames(ru))
      const channel = this.channelBank.addFramesToChannel(
        frames,
        tx.blockNumber,
      )
      // no channel was closed in this tx, so no txs were finalized
      if (!channel) {
        return []
      }
      const assembledChannel = channel.assemble()
      const encodedBatches = await getBatchFromChannel(assembledChannel)

      /** Block number of the bedrock upgrade to properly calculate block number.
       * Only applied to OP Mainnet.
       * https://docs.optimism.io/builders/node-operators/network-upgrades#activations
       */
      const blockOffset = this.projectId === 'optimism' ? 105235063 : 0

      const result = []
      for (const encodedBatch of encodedBatches) {
        const blocksWithTimestamps = decodeBatch(encodedBatch, {
          ...this.opts,
          blockOffset,
        })
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

  async getRollupData(tx: EVMTransaction): Promise<Uint8Array[]> {
    switch (Number(tx.type)) {
      case 2:
        return [byteArrFromHexStr(tx.data)]
      case 3: {
        assert(
          tx.blobVersionedHashes,
          'Type 3 transaction missing blobVersionedHashes',
        )
        assert(tx.blockNumber, `Tx ${tx}: No pending txs allowed`)
        const { blobs } =
          await this.blobProvider.getBlobsByVersionedHashesAndBlockNumber(
            tx.blobVersionedHashes,
            tx.blockNumber,
          )
        if (blobs.length === 0) return []
        return getRollupData(blobs)
      }
      default:
        throw new Error(`Unsupported transaction type: ${tx.type}`)
    }
  }
}
