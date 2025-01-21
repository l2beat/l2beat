import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { z } from 'zod'

import { BaseAnalyzer } from './types/BaseAnalyzer'
import type { L2Block, Transaction } from './types/BaseAnalyzer'

const ScrollBatchCommit = z.object({
  version: z.number(),
  parentBatchHeader: z.string(),
  chunks: z.array(z.string()),
  skippedL1MessageBitmap: z.string(),
})

export class ScrollT2IAnalyzer extends BaseAnalyzer {
  override getTrackedTxSubtype(): TrackedTxsConfigSubtype {
    return 'batchSubmissions'
  }

  async analyze(
    _previousTransaction: Transaction,
    transaction: Transaction,
  ): Promise<L2Block[]> {
    const tx = await this.provider.getTransaction(transaction.txHash)
    const decodedTransactionData = decodeTransaction(tx.data)

    const rawBlockContexts = decodedTransactionData.chunks
      .map(toBlockContexts)
      .flat()

    return rawBlockContexts.map(decodeBlockContext)
  }
}

function decodeTransaction(data: string) {
  // https://docs.scroll.io/en/technology/overview/scroll-upgrades/#darwin-upgrade
  const signature =
    'commitBatchWithBlobProof(uint8 _version,bytes _parentBatchHeader,bytes[] _chunks,bytes _skippedL1MessageBitmap,bytes _blobDataProof)'
  const iface = new utils.Interface([`function ${signature}`])

  const decodedInput = iface.decodeFunctionData(signature, data)

  return ScrollBatchCommit.parse({
    version: decodedInput._version,
    parentBatchHeader: decodedInput._parentBatchHeader,
    chunks: decodedInput._chunks,
    skippedL1MessageBitmap: decodedInput._skippedL1MessageBitmap,
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
 * @see https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/ChunkCodecV0.sol
 * @see https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/ChunkCodecV1.sol
 */
function decodeBlockContext(rawBlockContext: string): L2Block {
  const BLOCK_NUMBER_START = 0 * 2 // 0th byte inclusive
  const BLOCK_NUMBER_END = 8 * 2 // 8th byte exclusive
  const TIMESTAMP_START = 8 * 2 // 8th byte inclusive
  const TIMESTAMP_END = 16 * 2 // 16th byte exclusive

  const hexBlockNumber = rawBlockContext.slice(
    BLOCK_NUMBER_START,
    BLOCK_NUMBER_END,
  )
  const hexTimestamp = rawBlockContext.slice(TIMESTAMP_START, TIMESTAMP_END)

  return {
    blockNumber: parseInt(hexBlockNumber, 16),
    timestamp: parseInt(hexTimestamp, 16),
  }
}
