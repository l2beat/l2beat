import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { LineaFinalityAnalyzer } from './LineaFinalityAnalyzer'

describe(LineaFinalityAnalyzer.name, () => {
  describe(LineaFinalityAnalyzer.prototype.getFinality.name, () => {
    it('correctly decode and returns correct data for calldata example', async () => {
      const livenessRepository = mockLivenessRepository()
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockCallData(2371262, 2371336),
        }),
      })
      const l2provider = mockL2RpcClient(TIMESTAMPS1)
      const l1Timestamp = 1708352483

      const calculator = new LineaFinalityAnalyzer(
        provider,
        livenessRepository,
        ProjectId('linea'),
        l2provider,
      )
      const results = await calculator.getFinality({
        txHash: '0x121',
        timestamp: new UnixTime(l1Timestamp),
      })

      expect(results).toEqualUnsorted([
        l1Timestamp - Math.min(...TIMESTAMPS1),
        l1Timestamp - Math.max(...TIMESTAMPS1),
      ])
    })

    it('correctly decode and returns correct data for blob example', async () => {
      const livenessRepository = mockLivenessRepository()
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockBlobCalldata(2371262, 2371336),
        }),
      })
      const l2provider = mockL2RpcClient(TIMESTAMPS1)
      const l1Timestamp = 1708352483

      const calculator = new LineaFinalityAnalyzer(
        provider,
        livenessRepository,
        ProjectId('linea'),
        l2provider,
      )
      const results = await calculator.getFinality({
        txHash: '0x121',
        timestamp: new UnixTime(l1Timestamp),
      })

      expect(results).toEqualUnsorted([
        l1Timestamp - Math.min(...TIMESTAMPS1),
        l1Timestamp - Math.max(...TIMESTAMPS1),
      ])
    })
  })
})

function mockLivenessRepository() {
  return mockObject<LivenessRepository>({
    findTransactionWithinTimeRange: mockFn().resolvesTo({
      txHash: '0x121',
      timestamp: new UnixTime(1705407431),
    }),
  })
}

function mockL2RpcClient(timestamps: number[]) {
  const getBlock = mockFn()
  timestamps.forEach((timestamp) => {
    getBlock.resolvesToOnce({
      timestamp,
    })
  })
  return mockObject<RpcClient>({
    getBlock,
  })
}

const TIMESTAMPS1 = Array.from({ length: 2 }, (_, i) => 1706143081 + i)

function mockCallData(firstBlock: number, endBlock: number): string {
  const fnSignature =
    'submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))'
  const iface = new utils.Interface([`function ${fnSignature}`])

  const sampleData = [
    [
      utils.formatBytes32String(''),
      utils.formatBytes32String(''),
      utils.formatBytes32String(''),
      firstBlock,
      endBlock,
      utils.formatBytes32String(''),
      utils.randomBytes(0),
    ],
  ]
  return iface.encodeFunctionData('submitData', sampleData)
}

function mockBlobCalldata(firstBlock: number, endBlock: number): string {
  const fn =
    'function submitBlobData(tuple(bytes32 parentStateRootHash, bytes32 dataParentHash, bytes32 finalStateRootHash, uint256 firstBlockInData, uint256 finalBlockInData, bytes32 snarkHash) _submissionData, uint256 _dataEvaluationClaim, bytes _kzgCommitment, bytes _kzgProof)'
  const iface = new utils.Interface([fn])

  const randomNumber = Math.floor(Math.random() * 100_000_000)

  const sampleData = [
    [
      utils.formatBytes32String(''),
      utils.formatBytes32String(''),
      utils.formatBytes32String(''),
      firstBlock,
      endBlock,
      utils.formatBytes32String(''),
    ],
    randomNumber,
    utils.randomBytes(40),
    utils.randomBytes(40),
  ]
  return iface.encodeFunctionData('submitBlobData', sampleData)
}
