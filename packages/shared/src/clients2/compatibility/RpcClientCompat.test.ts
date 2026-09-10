import { expect, mockFn, mockObject } from 'earl'
import type { EthRpcClient, RpcBlock } from '../EthRpcClient'
import { RpcClientCompat } from './RpcClientCompat'

describe(RpcClientCompat.name, () => {
  describe(RpcClientCompat.prototype.getBlockTimestamp.name, () => {
    it('fetches the block without transaction bodies', async () => {
      const header = {
        hash: `0x${'ab'.repeat(32)}`,
        number: 100n,
        timestamp: 1_000n,
        logsBloom: '0x',
        transactions: [],
      } as unknown as RpcBlock
      const getBlockByNumber = mockFn().resolvesTo(header)
      const client = new RpcClientCompat(
        mockObject<EthRpcClient>({ getBlockByNumber }),
        'chain',
      )

      const timestamp = await client.getBlockTimestamp(100)

      expect(timestamp).toEqual(1_000)
      expect(getBlockByNumber).toHaveBeenOnlyCalledWith(100n, false)
    })
  })
})
