import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { LoopringClient } from '../../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { LoopringFinalityAnalyzer } from './LoopringFinalityAnalyzer'

describe(LoopringFinalityAnalyzer.name, () => {
  describe(LoopringFinalityAnalyzer.prototype.getFinality.name, () => {
    it('should return timestamp differences between l1 and l2 blocks', async () => {
      const projectId = ProjectId('loopring')
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          wait: mockFn().resolvesTo({
            logs: MOCK_DATA.logs,
          }),
        }),
      })
      const livenessRepository = mockObject<LivenessRepository>({})
      const loopringClient = mockObject<LoopringClient>({})

      const analyzer = new LoopringFinalityAnalyzer(
        rpcClient,
        livenessRepository,
        projectId,
        loopringClient,
      )

      const result = await analyzer.getFinality({
        txHash: MOCK_DATA.txHash,
        timestamp: new UnixTime(MOCK_DATA.l1Timestamp),
      })

      expect(result).toEqual([MOCK_DATA.l1Timestamp - MOCK_DATA.blockCreatedAt])
    })
  })
})

const MOCK_DATA = {
  txHash: '0x49da47a407479c77bcf9669f7a7380d37e591f9b9c715e5646d56213f4223cf3',
  logs: [
    {
      transactionIndex: 69,
      blockNumber: 17303786,
      transactionHash:
        '0x49da47a407479c77bcf9669f7a7380d37e591f9b9c715e5646d56213f4223cf3',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [Array],
      data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ed94ddc597721a976d86a5d2be11d0d445dffb90000000000000000000000000ed94ddc597721a976d86a5d2be11d0d445dffb90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003aef9b8c2dd000',
      logIndex: 121,
      blockHash:
        '0xa7c061c936b2626499ad714ab9673e0ed5b3077f08ef3a29e78f94f41fbb7109',
    },
    {
      transactionIndex: 69,
      blockNumber: 17303786,
      transactionHash:
        '0x49da47a407479c77bcf9669f7a7380d37e591f9b9c715e5646d56213f4223cf3',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      topics: [Array],
      data: '0x00000000000000000000000000000000000000000000000000000000055a3d40',
      logIndex: 122,
      blockHash:
        '0xa7c061c936b2626499ad714ab9673e0ed5b3077f08ef3a29e78f94f41fbb7109',
    },
    {
      transactionIndex: 69,
      blockNumber: 17303786,
      transactionHash:
        '0x49da47a407479c77bcf9669f7a7380d37e591f9b9c715e5646d56213f4223cf3',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d126aebceddf1214004afb08a07d1fa9570673d800000000000000000000000078df1a114bda8675045cf477a0460e8e787512ca000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000055a3d40',
      logIndex: 123,
      blockHash:
        '0xa7c061c936b2626499ad714ab9673e0ed5b3077f08ef3a29e78f94f41fbb7109',
    },
    {
      transactionIndex: 69,
      blockNumber: 17303786,
      transactionHash:
        '0x49da47a407479c77bcf9669f7a7380d37e591f9b9c715e5646d56213f4223cf3',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000554308c4dc3ec7d074eabba8032a3e234f7d3be2000000000000000000000000e9948d8a1e47baab46f1c3ca0beb5cafacba049d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c6bf526340000',
      logIndex: 124,
      blockHash:
        '0xa7c061c936b2626499ad714ab9673e0ed5b3077f08ef3a29e78f94f41fbb7109',
    },
    {
      transactionIndex: 69,
      blockNumber: 17303786,
      transactionHash:
        '0x49da47a407479c77bcf9669f7a7380d37e591f9b9c715e5646d56213f4223cf3',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [Array],
      data: '0x19a9766b9faf4b798fbfd4f9882ae3582565a4f5f338c2967e72e59d054b551dd20d87ac463e57116e8da7b8bee0026ee472b8df445d44059522a6404517621f',
      logIndex: 125,
      blockHash:
        '0xa7c061c936b2626499ad714ab9673e0ed5b3077f08ef3a29e78f94f41fbb7109',
    },
  ],
  l1Timestamp: 1684624031,
  blockCreatedAt: 1684623244,
  diff: 787,
} as const
