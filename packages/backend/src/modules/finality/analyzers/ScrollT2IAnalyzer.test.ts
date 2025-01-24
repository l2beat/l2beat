import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import type { Database } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { ScrollT2IAnalyzer } from './ScrollT2IAnalyzer'
import type { L2Block } from './types/BaseAnalyzer'

describe(ScrollT2IAnalyzer.name, () => {
  describe(ScrollT2IAnalyzer.prototype.analyze.name, () => {
    it('should return timestamp differences between l1 and l2 blocks', async () => {
      const TX_HASH = '0x123'
      const L1_TIMESTAMP = 1700001000
      const L2_BLOCKS: L2Block[] = [
        { blockNumber: 123, timestamp: 1700000000 },
        { blockNumber: 124, timestamp: 1700000003 },
        { blockNumber: 125, timestamp: 1700000006 },
        { blockNumber: 126, timestamp: 1700000009 },
        { blockNumber: 127, timestamp: 1700000012 },
      ]

      const projectId = ProjectId('scroll')
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockCommitBatchWithBlobProof(L2_BLOCKS),
        }),
      })

      const analyzer = new ScrollT2IAnalyzer(
        rpcClient,
        mockObject<Database>(),
        projectId,
      )

      const tx = { txHash: TX_HASH, timestamp: new UnixTime(L1_TIMESTAMP) }
      const previousTx = tx // not used
      const result = await analyzer.analyze(previousTx, tx)

      expect(result).toEqual(L2_BLOCKS)
    })
  })
})

function mockCommitBatchWithBlobProof(l2Blocks: L2Block[]): string {
  const signature =
    'commitBatchWithBlobProof(uint8 _version,bytes _parentBatchHeader,bytes[] _chunks,bytes _skippedL1MessageBitmap,bytes _blobDataProof)'
  const iface = new utils.Interface([`function ${signature}`])

  const mockChunks = l2Blocks.map((b) =>
    createMockChunk(b.blockNumber, b.timestamp),
  )

  const mockData = [
    1,
    '0x' + '00'.repeat(32),
    mockChunks,
    '0x' + '00'.repeat(32),
    '0x' + '00'.repeat(32),
  ]

  return iface.encodeFunctionData('commitBatchWithBlobProof', mockData)
}

function createMockChunk(blockNumber: number, timestamp: number): string {
  const BLOCKS_IN_CHUNK = 1
  const BLOCK_CONTEXT_SIZE = 60

  const chunkSize = 1 + BLOCK_CONTEXT_SIZE
  const chunk = new Uint8Array(chunkSize)

  chunk[0] = BLOCKS_IN_CHUNK

  const blockContext = new Uint8Array(BLOCK_CONTEXT_SIZE)
  const view = new DataView(blockContext.buffer)

  // Set block number at the correct position (0th byte, 8 bytes long)
  view.setBigUint64(0, BigInt(blockNumber), false)

  // Set timestamp at the correct position (8th byte, 8 bytes long)
  view.setBigUint64(8, BigInt(timestamp), false)

  // Fill the rest of the block context with dummy data
  for (let i = 0; i < BLOCK_CONTEXT_SIZE; i++) {
    if (i >= 16) {
      blockContext[i] = i % 256
    }
  }

  chunk.set(blockContext, 1)
  return '0x' + Buffer.from(chunk).toString('hex')
}
