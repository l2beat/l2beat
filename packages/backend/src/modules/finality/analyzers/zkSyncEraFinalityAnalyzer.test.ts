import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { zkSyncEraFinalityAnalyzer } from './zkSyncEraFinalityAnalyzer'

describe(zkSyncEraFinalityAnalyzer.name, () => {
  describe(zkSyncEraFinalityAnalyzer.prototype.analyze.name, () => {
    it('correctly decode and returns correct data', async () => {
      const mockRepo = mockObject<LivenessRepository>()
      const provider = getMockRpcClient()

      const l1Timestamp = 1705407431

      const calculator = new zkSyncEraFinalityAnalyzer(
        provider,
        mockRepo,
        mockObject<IndexerConfigurationRepository>({}),
        ProjectId('zksync2'),
      )
      const results = await calculator.analyze({
        txHash: '0x121',
        timestamp: new UnixTime(l1Timestamp),
      })

      expect(results).toEqualUnsorted(
        DATA1_TIMESTAMPS.map((t) => l1Timestamp - t),
      )
    })
  })
})

function getMockRpcClient() {
  return mockObject<RpcClient>({
    getTransaction: mockFn().resolvesTo({
      data: getMockCallData(DATA1_TIMESTAMPS),
    }),
  })
}

const DATA1_TIMESTAMPS = [
  1705373738, 1705373744, 1705373750, 1705373756, 1705373762, 1705373768,
  1705373774, 1705373780, 1705373786, 1705373792, 1705373798, 1705373804,
  1705373810,
]

function getMockCallData(timestamps: number[]): string {
  const fnSignature =
    'proveBatchesSharedBridge(uint256 _chainId, (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment), (uint64 batchNumber, bytes32 batchHash, uint64 indexRepeatedStorageChanges, uint256 numberOfLayer1Txs, bytes32 priorityOperationsHash, bytes32 l2LogsTreeRoot, uint256 timestamp, bytes32 commitment)[], (uint256[] recursiveAggregationInput, uint256[] serializedProof))'
  const iface = new utils.Interface([`function ${fnSignature}`])

  const tuples = timestamps
    .slice(1)
    .map((timestamp) => createMockTuple(timestamp))
  const mockChainId = 1
  const sampleData = [
    mockChainId,
    createMockTuple(timestamps[0]),
    tuples,
    [[], []],
  ]
  return iface.encodeFunctionData('proveBatchesSharedBridge', sampleData)
}

function createMockTuple(timestamp: number) {
  return [
    0,
    utils.formatBytes32String(''),
    0,
    0,
    utils.formatBytes32String(''),
    utils.formatBytes32String(''),
    timestamp,
    utils.formatBytes32String(''),
  ]
}
