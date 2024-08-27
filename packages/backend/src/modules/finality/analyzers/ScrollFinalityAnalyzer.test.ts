import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { Database } from '@l2beat/database'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { ScrollFinalityAnalyzer } from './ScrollFinalityAnalyzer'

describe(ScrollFinalityAnalyzer.name, () => {
  describe(ScrollFinalityAnalyzer.prototype.analyze.name, () => {
    it('should return timestamp differences between l1 and l2 blocks', async () => {
      const TX_HASH = '0x123'
      const L1_TIMESTAMP = 1700001000
      const L2_TIMESTAMPS = [
        1700000000, 1700000003, 1700000006, 1700000009, 1700000012,
      ]

      const projectId = ProjectId('scroll')
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockCommitBatchWithBlobProof(L2_TIMESTAMPS),
        }),
      })

      const analyzer = new ScrollFinalityAnalyzer(
        rpcClient,
        mockObject<Database>(),
        projectId,
      )

      const result = await analyzer.analyze({
        txHash: TX_HASH,
        timestamp: new UnixTime(L1_TIMESTAMP),
      })

      expect(result).toEqual(
        L2_TIMESTAMPS.map((L2_TIMESTAMP) => L1_TIMESTAMP - L2_TIMESTAMP),
      )
    })
  })
})

function mockCommitBatchWithBlobProof(l2Timestamps: number[]): string {
  const signature =
    'commitBatchWithBlobProof(uint8 _version,bytes _parentBatchHeader,bytes[] _chunks,bytes _skippedL1MessageBitmap,bytes _blobDataProof)'
  const iface = new utils.Interface([`function ${signature}`])

  const mockChunks = l2Timestamps.map((timestamp) => createMockChunk(timestamp))

  const mockData = [
    1,
    '0x' + '00'.repeat(32),
    mockChunks,
    '0x' + '00'.repeat(32),
    '0x' + '00'.repeat(32),
  ]

  return iface.encodeFunctionData('commitBatchWithBlobProof', mockData)
}

function createMockChunk(timestamp: number): string {
  const BLOCKS_IN_CHUNK = 1
  const BLOCK_CONTEXT_SIZE = 60

  const chunkSize = 1 + BLOCK_CONTEXT_SIZE
  const chunk = new Uint8Array(chunkSize)

  chunk[0] = BLOCKS_IN_CHUNK

  const blockContext = new Uint8Array(BLOCK_CONTEXT_SIZE)
  const view = new DataView(blockContext.buffer)

  // Set timestamp at the correct position (8th byte, 8 bytes long)
  view.setBigUint64(8, BigInt(timestamp), false)

  // Fill the rest of the block context with dummy data
  for (let i = 0; i < BLOCK_CONTEXT_SIZE; i++) {
    if (i < 8 || i >= 16) {
      blockContext[i] = i % 256
    }
  }

  chunk.set(blockContext, 1)
  return '0x' + Buffer.from(chunk).toString('hex')
}
