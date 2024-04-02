import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { zkSyncEraFinalityAnalyzer } from './zkSyncEraFinalityAnalyzer'

describe(zkSyncEraFinalityAnalyzer.name, () => {
  describe(zkSyncEraFinalityAnalyzer.prototype.getFinality.name, () => {
    it('correctly decode and returns correct data', async () => {
      const livenessRepository = getMockLivenessRepository()
      const provider = getMockRpcClient()

      const l1Timestamp = 1705407431

      const calculator = new zkSyncEraFinalityAnalyzer(
        provider,
        livenessRepository,
        ProjectId('zksync2'),
      )
      const results = await calculator.getFinality({
        txHash: '0x121',
        timestamp: new UnixTime(l1Timestamp),
      })

      expect(results).toEqualUnsorted(
        DATA1_TIMESTAMPS.map((t) => l1Timestamp - t),
      )
    })
  })
})

function getMockLivenessRepository() {
  return mockObject<LivenessRepository>({
    findTransactionWithinTimeRange: mockFn().resolvesTo({
      txHash: '0x121',
      timestamp: new UnixTime(1705407431),
    }),
  })
}

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

const DATA2_TIMESTAMPS = [
  1706143081, 1706143085, 1706143089, 1706143093, 1706143097, 1706143101,
  1706143105, 1706143109, 1706143113, 1706143117, 1706143121, 1706143125,
  1706143129, 1706143133, 1706143137, 1706143141, 1706143145, 1706143149,
  1706143153, 1706143157, 1706143161, 1706143165, 1706143169, 1706143173,
  1706143177, 1706143181, 1706143185, 1706143189,
]

function getMockCallData(timestamps: number[]): string {
  const fnSignature =
    'proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32), (uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[], (uint256[],uint256[]))'
  const iface = new utils.Interface([`function ${fnSignature}`])

  const tuples = timestamps
    .slice(1)
    .map((timestamp) => createMockTuple(timestamp))

  const sampleData = [createMockTuple(timestamps[0]), tuples, [[], []]]
  return iface.encodeFunctionData('proveBatches', sampleData)
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
