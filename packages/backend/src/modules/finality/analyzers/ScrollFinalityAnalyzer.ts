import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
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
    const tx = await this.provider.getTransaction(transaction.txHash)
    const l1Timestamp = transaction.timestamp

    const decodedTransactionData = decodeTransaction(tx.data)

    const rawBlockContexts = decodedTransactionData.chunks
      .map(toBlockContexts)
      .flat()

    const l2Timestamps = rawBlockContexts.map(decodeBlockContext)

    return l2Timestamps.map(
      (l2Timestamp) => l1Timestamp.toNumber() - l2Timestamp,
    )
  }
}

function decodeTransaction(data: string) {
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
 * Converts a chunk to a list of block contexts
 * @param chunk 0x-padded hex-string
 * @returns a list of block contexts ready for parsing
 */
function toBlockContexts(chunk: string) {
  const BLOCKS_IN_CHUNK_START = 2 // skip '0x'
  const BLOCKS_IN_CHUNK_END = 4 // 1 byte

  const BLOCK_CONTEXT_SIZE = 60 * 2 // 60 bytes

  const amountOfBlocksInChunk = parseInt(
    chunk.slice(BLOCKS_IN_CHUNK_START, BLOCKS_IN_CHUNK_END),
    16,
  )

  return Array.from({ length: amountOfBlocksInChunk }, (_, i) => {
    const byteFrom = BLOCKS_IN_CHUNK_END + i * BLOCK_CONTEXT_SIZE
    const byteTo = byteFrom + BLOCK_CONTEXT_SIZE

    return chunk.slice(byteFrom, byteTo)
  })
}

/**
 * @see https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/ChunkCodecV0.sol
 * @see https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/ChunkCodecV1.sol
 */
function decodeBlockContext(rawBlockContext: string) {
  const TIMESTAMP_START = 8 * 2 // 8th byte inclusive
  const TIMESTAMP_END = 16 * 2 // 16th byte exclusive

  const hexTimestamp = rawBlockContext.slice(TIMESTAMP_START, TIMESTAMP_END)

  return parseInt(hexTimestamp, 16)
}
