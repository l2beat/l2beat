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

  describe(
    LineaFinalityAnalyzer.prototype.getFinalityWithGranularity.name,
    () => {
      it('correctly split date for a given granularity', async () => {
        const livenessRepository = mockLivenessRepository()
        const provider = mockRpcClient()
        const l2provider = mockL2RpcClient(TIMESTAMPS2)

        const start = UnixTime.now().toStartOf('hour')
        const calculator = new LineaFinalityAnalyzer(
          provider,
          livenessRepository,
          ProjectId('linea'),
          l2provider,
        )

        await calculator.getFinalityWithGranularity(
          start.add(-1, 'hours'),
          start,
          6,
        )

        expect(
          livenessRepository.findTransactionWithinTimeRange,
        ).toHaveBeenNthCalledWith(
          1,
          ProjectId('linea'),
          'batchSubmissions',
          start,
          start.add(-600, 'seconds'),
        )

        expect(
          livenessRepository.findTransactionWithinTimeRange,
        ).toHaveBeenNthCalledWith(
          6,
          ProjectId('linea'),
          'batchSubmissions',
          start.add(-600 * 5, 'seconds'),
          start.add(-600 * 6, 'seconds'),
        )

        expect(
          livenessRepository.findTransactionWithinTimeRange,
        ).toHaveBeenCalledTimes(6)
        expect(provider.getTransaction).toHaveBeenCalledTimes(6)
      })

      it('correctly decode for multiple txs with one not found', async () => {
        const start = UnixTime.now().toStartOf('hour')
        const firstL1Timestamp = 1708300000
        const secondL1Timestamp = 1709300000

        const livenessRepository = mockObject<LivenessRepository>({
          findTransactionWithinTimeRange: mockFn()
            .resolvesToOnce({
              txHash: '0x121',
              timestamp: new UnixTime(firstL1Timestamp),
            })
            .resolvesToOnce({
              txHash: '0x121',
              timestamp: new UnixTime(secondL1Timestamp),
            })
            .resolvesToOnce(undefined),
        })

        const provider = mockObject<RpcClient>({
          getTransaction: mockFn()
            .resolvesToOnce({
              data: mockCallData(2300000, 2300348),
            })
            .resolvesToOnce({
              data: mockCallData(2400000, 2400100),
            }),
        })

        const blockTimestamps = [1706143000, 1706145000, 1706144000, 1706146000]

        const l2provider = mockL2RpcClient(blockTimestamps)

        const calculator = new LineaFinalityAnalyzer(
          provider,
          livenessRepository,
          ProjectId('linea'),
          l2provider,
        )
        const results = await calculator.getFinalityWithGranularity(
          start.add(-1, 'hours'),
          start,
          3,
        )

        if (results) {
          expect(results).toEqualUnsorted([
            firstL1Timestamp - blockTimestamps[0],
            firstL1Timestamp - blockTimestamps[1],
            secondL1Timestamp - blockTimestamps[2],
            secondL1Timestamp - blockTimestamps[3],
          ])
        }

        expect(
          livenessRepository.findTransactionWithinTimeRange,
        ).toHaveBeenCalledTimes(3)
        expect(provider.getTransaction).toHaveBeenCalledTimes(2)
      })
    },
  )
})

function mockLivenessRepository() {
  return mockObject<LivenessRepository>({
    findTransactionWithinTimeRange: mockFn().resolvesTo({
      txHash: '0x121',
      timestamp: new UnixTime(1705407431),
    }),
  })
}

function mockRpcClient() {
  return mockObject<RpcClient>({
    getTransaction: mockFn().resolvesTo({
      data: mockCallData(2371262, 2371336),
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
const TIMESTAMPS2 = Array.from({ length: 75 * 6 }, (_, i) => 1706143081 + i)

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
