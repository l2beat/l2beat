import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { Database } from '@l2beat/database'
import { RpcClient } from '@l2beat/shared'
import { LineaT2IAnalyzer } from './LineaT2IAnalyzer'

describe(LineaT2IAnalyzer.name, () => {
  describe(LineaT2IAnalyzer.prototype.analyze.name, () => {
    it('correctly decode and returns correct data for calldata example', async () => {
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockCallData(2371262, 2371336),
        }),
      })
      const l2provider = mockL2RpcClient(TIMESTAMPS1)
      const l1Timestamp = 1708352483

      const calculator = new LineaT2IAnalyzer(
        provider,
        mockObject<Database>(),
        ProjectId('linea'),
        l2provider,
      )
      const tx = { txHash: '0x121', timestamp: new UnixTime(l1Timestamp) }
      const previousTx = tx // not used
      const results = await calculator.analyze(previousTx, tx)

      expect(results).toEqualUnsorted([
        {
          blockNumber: 2371262,
          timestamp: Math.min(...TIMESTAMPS1),
        },
        {
          blockNumber: 2371336,
          timestamp: Math.max(...TIMESTAMPS1),
        },
      ])
    })

    it('correctly decode and returns correct data for blob example', async () => {
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockBlobCalldata(2371262, 2371336),
        }),
      })
      const l2provider = mockL2RpcClient(TIMESTAMPS1)
      const l1Timestamp = 1708352483

      const calculator = new LineaT2IAnalyzer(
        provider,
        mockObject<Database>(),
        ProjectId('linea'),
        l2provider,
      )
      const tx = { txHash: '0x121', timestamp: new UnixTime(l1Timestamp) }
      const previousTx = tx // not used
      const results = await calculator.analyze(previousTx, tx)

      expect(results).toEqualUnsorted([
        {
          blockNumber: 2371262,
          timestamp: Math.min(...TIMESTAMPS1),
        },
        {
          blockNumber: 2371336,
          timestamp: Math.max(...TIMESTAMPS1),
        },
      ])
    })
  })
})

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
    'function submitBlobs(((bytes32,uint256,uint256,bytes32),uint256,bytes,bytes)[], bytes32, bytes32)'
  const iface = new utils.Interface([fn])

  const randomNumber = Math.floor(Math.random() * 100_000_000)

  const sampleData = [
    [
      [
        [
          utils.formatBytes32String(''),
          firstBlock,
          endBlock,
          utils.formatBytes32String(''),
        ],
        randomNumber,
        utils.randomBytes(40),
        utils.randomBytes(40),
      ],
    ],
    utils.formatBytes32String(''),
    utils.formatBytes32String(''),
  ]

  return iface.encodeFunctionData('submitBlobs', sampleData)
}
