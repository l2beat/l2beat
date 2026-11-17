import type { IRpcClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { RpcHeadSource } from './RpcHeadSource'

describe(RpcHeadSource.name, () => {
  describe(RpcHeadSource.prototype.getLatestBlockNumber.name, () => {
    it('asks for the block number, never for the latest block', async () => {
      const rpc = mockObject<IRpcClient>({
        getLatestBlockNumber: mockFn().resolvesTo(100),
      })

      expect(await new RpcHeadSource(rpc).getLatestBlockNumber()).toEqual(100)
    })
  })

  describe(RpcHeadSource.prototype.getBlocks.name, () => {
    it('returns the blocks with their transactions, oldest first', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlockWithTransactions: mockFn(async (number: number | 'latest') =>
          block(number as number),
        ),
      })

      const blocks = await new RpcHeadSource(rpc).getBlocks(10, 12)

      expect(blocks).toEqual([block(10), block(11), block(12)])
    })

    it('rejects a block other than the one asked for', async () => {
      const rpc = mockObject<IRpcClient>({
        getBlockWithTransactions: async () => block(12),
      })

      await expect(new RpcHeadSource(rpc).getBlocks(10, 10)).toBeRejectedWith(
        'Invalid block number in response',
      )
    })
  })

  describe(RpcHeadSource.prototype.getBlockHash.name, () => {
    it("reads the hash from the block's header", async () => {
      const rpc = mockObject<IRpcClient>({
        getBlock: mockFn().resolvesTo({ ...block(10), hash: '0xabc' }),
      })

      expect(await new RpcHeadSource(rpc).getBlockHash(10)).toEqual('0xabc')
      // getBlock is overloaded, and the mock takes only its last signature
      expect(rpc.getBlock.calls.map((c) => c.args as unknown[])).toEqual([
        [10, false],
      ])
    })
  })
})

function block(number: number) {
  return {
    number,
    hash: `0x${number}`,
    parentHash: `0x${number - 1}`,
    timestamp: 1_800_000_000 + number,
    logsBloom: '0x',
    gasUsed: 30_000_000,
    transactions: [],
  }
}
