import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { LineaFinalityAnalyzer } from './LineaFinalityAnalyzer'

describe(LineaFinalityAnalyzer.name, () => {
  describe(LineaFinalityAnalyzer.prototype.getFinality.name, () => {
    it('correctly decode and returns correct data', async () => {
      const livenessRepository = getMockLivenessRepository()
      const provider = getMockRpcClient()
      const l2provider = getMockL2RpcClient(TIMESTAMPS1)
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
        const livenessRepository = getMockLivenessRepository()
        const provider = getMockRpcClient()
        const l2provider = getMockL2RpcClient(TIMESTAMPS2)

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
              data: getMockCallData(2300000, 2300348),
            })
            .resolvesToOnce({
              data: getMockCallData(2400000, 2400100),
            }),
        })

        const l2provider = getMockL2RpcClient([
          1706143000, 1706145000, 1706144000, 1706146000,
        ])

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
            firstL1Timestamp - 1706143000,
            firstL1Timestamp - 1706144000,
            secondL1Timestamp - 1706145000,
            secondL1Timestamp - 1706146000,
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
      data: getMockCallData(2371262, 2371336),
    }),
  })
}

function getMockL2RpcClient(timestamps: number[]) {
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

function getMockCallData(firstBlock: number, endBlock: number): string {
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
