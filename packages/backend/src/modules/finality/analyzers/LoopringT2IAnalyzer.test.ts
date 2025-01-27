import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { Database } from '@l2beat/database'
import type { LoopringClient, RpcClient } from '@l2beat/shared'
import { LoopringT2IAnalyzer } from './LoopringT2IAnalyzer'

describe(LoopringT2IAnalyzer.name, () => {
  describe(LoopringT2IAnalyzer.prototype.analyze.name, () => {
    it('should return timestamp differences between l1 and l2 blocks', async () => {
      const projectId = ProjectId('loopring')
      const rpcClient = mockObject<RpcClient>({
        getTransactionReceipt: mockFn().resolvesTo({
          logs: MOCK_DATA.logs,
        }),
      })
      const loopringClient = mockObject<LoopringClient>({
        getBlockWithTransactions: mockFn().resolvesTo({
          timestamp: MOCK_DATA.blockCreatedAt,
        }),
      })

      const analyzer = new LoopringT2IAnalyzer(
        rpcClient,
        mockObject<Database>(),
        projectId,
        loopringClient,
      )

      const tx = {
        txHash: MOCK_DATA.txHash,
        timestamp: new UnixTime(MOCK_DATA.l1Timestamp),
      }
      const previousTx = tx // not used
      const result = await analyzer.analyze(previousTx, tx)

      expect(result).toEqual([
        {
          blockNumber: 41025,
          timestamp: MOCK_DATA.blockCreatedAt,
        },
      ])
    })
  })
})

const MOCK_DATA = {
  txHash: '0x1afd89856e58a46ef69911e285073c7530a35adf61f8fd16488ebd7647a371cc',
  logs: [
    {
      transactionIndex: 136,
      blockNumber: 17317330,
      transactionHash:
        '0x1afd89856e58a46ef69911e285073c7530a35adf61f8fd16488ebd7647a371cc',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000674bdf20a0f284d710bc40872100128e2d66bd3f',
        '0x0000000000000000000000007487473f9cec56f24b60130b5875abb4a6b52b84',
      ],
      data: '0x0000000000000000000000000000000000000000000000000000000123a4070d',
      logIndex: 418,
      blockHash:
        '0xd2ac25fe82e8025b6c7ec69201617c3d1b5ee047b4fb2665ef7e4339d4f056f6',
    },
    {
      transactionIndex: 136,
      blockNumber: 17317330,
      transactionHash:
        '0x1afd89856e58a46ef69911e285073c7530a35adf61f8fd16488ebd7647a371cc',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [
        '0x0d22d7344fc6871a839149fd89f9fd88a6c29cf797a67114772a9d4df5f8c96b',
      ],
      data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000007487473f9cec56f24b60130b5875abb4a6b52b840000000000000000000000007487473f9cec56f24b60130b5875abb4a6b52b84000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000123a4070d',
      logIndex: 419,
      blockHash:
        '0xd2ac25fe82e8025b6c7ec69201617c3d1b5ee047b4fb2665ef7e4339d4f056f6',
    },
    {
      transactionIndex: 136,
      blockNumber: 17317330,
      transactionHash:
        '0x1afd89856e58a46ef69911e285073c7530a35adf61f8fd16488ebd7647a371cc',
      address: '0x21BfBDa47A0B4B5b1248c767Ee49F7caA9B23697',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000674bdf20a0f284d710bc40872100128e2d66bd3f',
        '0x000000000000000000000000a20faf0ed0ebfc0a8ad727e5992fcc8098136f9c',
      ],
      data: '0x00000000000000000000000000000000000000000000004df36f4f5aa4f4c000',
      logIndex: 420,
      blockHash:
        '0xd2ac25fe82e8025b6c7ec69201617c3d1b5ee047b4fb2665ef7e4339d4f056f6',
    },
    {
      transactionIndex: 136,
      blockNumber: 17317330,
      transactionHash:
        '0x1afd89856e58a46ef69911e285073c7530a35adf61f8fd16488ebd7647a371cc',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [
        '0x0d22d7344fc6871a839149fd89f9fd88a6c29cf797a67114772a9d4df5f8c96b',
      ],
      data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a20faf0ed0ebfc0a8ad727e5992fcc8098136f9c000000000000000000000000a20faf0ed0ebfc0a8ad727e5992fcc8098136f9c00000000000000000000000021bfbda47a0b4b5b1248c767ee49f7caa9b2369700000000000000000000000000000000000000000000004df36f4f5aa4f4c000',
      logIndex: 421,
      blockHash:
        '0xd2ac25fe82e8025b6c7ec69201617c3d1b5ee047b4fb2665ef7e4339d4f056f6',
    },
    {
      transactionIndex: 136,
      blockNumber: 17317330,
      transactionHash:
        '0x1afd89856e58a46ef69911e285073c7530a35adf61f8fd16488ebd7647a371cc',
      address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
      topics: [
        '0xcc86d9ed29ebae540f9d25a4976d4da36ea4161b854b8ecf18f491cf6b0feb5c',
        '0x000000000000000000000000000000000000000000000000000000000000a041',
      ],
      data: '0x28d27d222dd2bd64bb3eaee6496cd8ceee456ec4953e5d2b82eb65a2de37a2f5cad84b29158ff8e5522e4f772172e7f998a561d0d98dec7e8de3edbb301a94f0',
      logIndex: 422,
      blockHash:
        '0xd2ac25fe82e8025b6c7ec69201617c3d1b5ee047b4fb2665ef7e4339d4f056f6',
    },
  ],
  l1Timestamp: 1684788791,
  blockCreatedAt: 1684787946,
  diff: 845,
} as const
