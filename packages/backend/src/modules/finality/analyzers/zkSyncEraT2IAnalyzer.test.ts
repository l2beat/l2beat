import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import type { Database } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import type { L2Block } from './types/BaseAnalyzer'
import { zkSyncEraT2IAnalyzer } from './zkSyncEraT2IAnalyzer'

describe(zkSyncEraT2IAnalyzer.name, () => {
  describe(zkSyncEraT2IAnalyzer.prototype.analyze.name, () => {
    it('correctly decode and returns correct data', async () => {
      const provider = getMockRpcClient()

      const l1Timestamp = 1705407431

      const analyzer = new zkSyncEraT2IAnalyzer(
        provider,
        mockObject<Database>(),
        ProjectId('zksync2'),
      )
      const tx = { txHash: '0x121', timestamp: new UnixTime(l1Timestamp) }
      const previousTx = tx // not used
      const result = await analyzer.analyze(previousTx, tx)

      expect(result).toEqualUnsorted(DATA1_BLOCKS)
    })
  })
})

function getMockRpcClient() {
  return mockObject<RpcClient>({
    getTransaction: mockFn().resolvesTo({
      data: getMockCallData(DATA1_BLOCKS),
    }),
  })
}

const DATA1_BLOCKS: L2Block[] = [
  { timestamp: 1705373738, blockNumber: 123 },
  { timestamp: 1705373744, blockNumber: 124 },
  { timestamp: 1705373750, blockNumber: 125 },
  { timestamp: 1705373756, blockNumber: 126 },
  { timestamp: 1705373762, blockNumber: 127 },
  { timestamp: 1705373768, blockNumber: 128 },
  { timestamp: 1705373774, blockNumber: 129 },
  { timestamp: 1705373780, blockNumber: 130 },
  { timestamp: 1705373786, blockNumber: 131 },
  { timestamp: 1705373792, blockNumber: 132 },
  { timestamp: 1705373798, blockNumber: 133 },
  { timestamp: 1705373804, blockNumber: 134 },
  { timestamp: 1705373810, blockNumber: 135 },
]

function getMockCallData(blocks: L2Block[]): string {
  const fnSignature =
    'proveBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[], (uint256[] recursiveAggregationInput, uint256[] serializedProof))'
  const iface = new utils.Interface([`function ${fnSignature}`])

  const tuples = blocks.slice(1).map((block) => createMockTuple(block))
  const mockChainId = 1
  const sampleData = [mockChainId, createMockTuple(blocks[0]), tuples, [[], []]]
  return iface.encodeFunctionData('proveBatchesSharedBridge', sampleData)
}

function createMockTuple(block: L2Block) {
  return [
    block.blockNumber,
    utils.formatBytes32String(''),
    0,
    0,
    utils.formatBytes32String(''),
    utils.formatBytes32String(''),
    block.timestamp,
    utils.formatBytes32String(''),
  ]
}
