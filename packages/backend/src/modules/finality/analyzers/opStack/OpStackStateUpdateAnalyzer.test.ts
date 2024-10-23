import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'

import { Database } from '@l2beat/database'
import { RpcClient } from '../../../../peripherals/rpcclient/RpcClient'
import { OpStackStateUpdateAnalyzer } from './OpStackStateUpdateAnalyzer'

describe(OpStackStateUpdateAnalyzer.name, () => {
  describe(OpStackStateUpdateAnalyzer.prototype.analyze.name, () => {
    it('correctly decode and returns correct data for calldata example', async () => {
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockCallData(348523048),
        }),
      })
      const l2Timestamp = 1706143081
      const l1Timestamp = 1708352483
      const l2provider = mockL2RpcClient(l2Timestamp)

      const calculator = new OpStackStateUpdateAnalyzer(
        provider,
        mockObject<Database>(),
        ProjectId('zora'),
        l2provider,
      )
      const results = await calculator.analyze({
        txHash: '0x121',
        timestamp: new UnixTime(l1Timestamp),
      })

      expect(results).toEqualUnsorted([l1Timestamp - l2Timestamp])
    })
  })
})

function mockL2RpcClient(timestamp: number) {
  return mockObject<RpcClient>({
    getBlock: mockFn().resolvesToOnce({ timestamp }),
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
