import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import type { Database } from '@l2beat/database'
import type { RpcClient } from '@l2beat/shared'
import { OpStackStateUpdateAnalyzer } from './OpStackStateUpdateAnalyzer'

describe(OpStackStateUpdateAnalyzer.name, () => {
  describe(OpStackStateUpdateAnalyzer.prototype.analyze.name, () => {
    it('correctly decode and returns correct data for calldata example', async () => {
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockCallData(348523048),
        }),
      })
      const l2BlockTime = 2
      const prevoiusL2Timestamp = 1706141000
      const currentL2Timestamp = 1706141020
      const previousL1Timestamp = 1708351003
      const currentL1Timestamp = 1708352483
      const l2provider = mockL2RpcClient(
        prevoiusL2Timestamp,
        currentL2Timestamp,
      )

      const calculator = new OpStackStateUpdateAnalyzer(
        provider,
        mockObject<Database>(),
        ProjectId('zora'),
        l2BlockTime,
        l2provider,
      )
      const results = await calculator.analyze(
        { txHash: '0x123', timestamp: new UnixTime(previousL1Timestamp) },
        { txHash: '0x456', timestamp: new UnixTime(currentL1Timestamp) },
      )

      expect(results).toEqualUnsorted([
        { timestamp: 1706141002, blockNumber: 101 },
        { timestamp: 1706141004, blockNumber: 102 },
        { timestamp: 1706141006, blockNumber: 103 },
        { timestamp: 1706141008, blockNumber: 104 },
        { timestamp: 1706141010, blockNumber: 105 },
        { timestamp: 1706141012, blockNumber: 106 },
        { timestamp: 1706141014, blockNumber: 107 },
        { timestamp: 1706141016, blockNumber: 108 },
        { timestamp: 1706141018, blockNumber: 109 },
        { timestamp: 1706141020, blockNumber: 110 },
      ])
    })
  })
})

function mockL2RpcClient(prevTimestamp: number, currentTimestamp: number) {
  return mockObject<RpcClient>({
    getBlock: mockFn()
      .resolvesToOnce({ timestamp: prevTimestamp, number: 100 })
      .resolvesToOnce({ timestamp: currentTimestamp, number: 110 }),
  })
}

function mockCallData(blockNumber: number): string {
  const fnSignature =
    'proposeL2Output(bytes32 input, uint256 _l2BlockNumber, bytes32 input, uint256 input)'
  const iface = new utils.Interface([`function ${fnSignature}`])

  const sampleData = [
    utils.formatBytes32String(''),
    blockNumber,
    utils.formatBytes32String(''),
    0,
  ]
  return iface.encodeFunctionData('proposeL2Output', sampleData)
}
