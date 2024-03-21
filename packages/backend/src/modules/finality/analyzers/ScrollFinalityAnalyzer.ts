import { assert, TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { z } from 'zod'

import { BaseAnalyzer } from './types/BaseAnalyzer'

const ScrollBatchCommit = z.object({
  version: z.number(),
  parentBatchHeader: z.string(),
  chunks: z.array(z.string()),
  skippedL1MessageBitmap: z.string(),
})
type ScrollBatchCommit = z.infer<typeof ScrollBatchCommit>

export class ScrollFinalityAnalyzer extends BaseAnalyzer {
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async getFinality(transaction: {
    txHash: string
    timestamp: UnixTime
  }): Promise<number[]> {
    assert(this.l2Provider, 'Scroll RPC provider not defined')

    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedTransactionData = this.decodeTransaction(tx.data)

    const blockNumbers = decodedTransactionData.chunks
      .map((chunk) => this.decodeChunkBlockNumbers(chunk))
      .flat()

    const firstBlockInData = Math.max(...blockNumbers)
    const lastBlockInData = Math.min(...blockNumbers)

    const l2Blocks = await Promise.all([
      this.l2Provider.getBlock(firstBlockInData),
      this.l2Provider.getBlock(lastBlockInData),
    ])

    return l2Blocks.map((l2Block) => l1Timestamp.toNumber() - l2Block.timestamp)
  }

  private decodeTransaction(data: string) {
    const signature =
      'commitBatch(uint8 _version, bytes _parentBatchHeader, bytes[] _chunks, bytes _skippedL1MessageBitmap)'
    const iface = new utils.Interface([`function ${signature}`])

    const decodedInput = iface.decodeFunctionData(signature, data)

    return ScrollBatchCommit.parse({
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      version: decodedInput._version,
      parentBatchHeader: decodedInput._parentBatchHeader,
      chunks: decodedInput._chunks,
      skippedL1MessageBitmap: decodedInput._skippedL1MessageBitmap,
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    })
  }

  /**
   * @see https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/ChunkCodec.sol#L13
   */
  private decodeChunkBlockNumbers(chunk: string) {
    const BLOCK_CONTEXT_SIZE = 60 * 2 // 60 bytes
    const BLOCK_NUMBER_SIZE = 8 * 2 // 8 bytes

    const BLOCKS_IN_CHUNK_START = 2 // skip '0x'
    const BLOCKS_IN_CHUNK_END = 4 // 1 byte

    const BLOCK_CONTEXT_OFFSET = 4 // '0x' + 1 byte for block number

    const amountOfBlocksInChunk = parseInt(
      chunk.slice(BLOCKS_IN_CHUNK_START, BLOCKS_IN_CHUNK_END),
      16,
    )

    const blockNumbers = Array.from(
      { length: amountOfBlocksInChunk },
      (_, i) => {
        const blockNumberByteStart =
          BLOCK_CONTEXT_OFFSET + i * BLOCK_CONTEXT_SIZE
        const blockNumberByteEnd = blockNumberByteStart + BLOCK_NUMBER_SIZE

        const blockNumber = parseInt(
          chunk.slice(blockNumberByteStart, blockNumberByteEnd),
          16,
        )

        return blockNumber
      },
    )

    return blockNumbers
  }
}
