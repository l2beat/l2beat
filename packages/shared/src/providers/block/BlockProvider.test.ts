import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { BlockClient, RpcClient } from '../../clients'
import { BlockProvider } from './BlockProvider'

describe(BlockProvider.name, () => {
  describe(BlockProvider.prototype.getBlockWithTransactions.name, () => {
    it('returns block', async () => {
      const rpc = mockObject<RpcClient>({
        getBlockWithTransactions: async () => block(1),
      })
      const provider = new BlockProvider('chain', [rpc])

      const result = await provider.getBlockWithTransactions(1)

      expect(rpc.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(result).toEqual(block(1))
    })

    it('calls other client when there are errors', async () => {
      const rpc_one = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_two = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_three = mockObject<RpcClient>({
        getBlockWithTransactions: async () => block(1),
      })

      const provider = new BlockProvider('chain', [rpc_one, rpc_two, rpc_three])

      const result = await provider.getBlockWithTransactions(1)

      expect(rpc_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)

      expect(result).toEqual(block(1))
    })

    it('throws when ran out of fallbacks', async () => {
      const rpc_one = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_two = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_three = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error('ERROR')),
      })

      const provider = new BlockProvider('chain', [rpc_one, rpc_two, rpc_three])

      await expect(() => provider.getBlockWithTransactions(1)).toBeRejectedWith(
        'ERROR',
      )

      expect(rpc_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    })
  })

  describe(BlockProvider.prototype.getBlockNumberAtOrBefore.name, () => {
    it('uses bisection to get closest block number to given timestamp', async () => {
      const client = mockObject<BlockClient>({
        getLatestBlockNumber: async () => 1000,
        getBlockWithTransactions: mockFn()
          .resolvesToOnce(block(500))
          .resolvesToOnce(block(750))
          .resolvesToOnce(block(875))
          .resolvesToOnce(block(812))
          .resolvesToOnce(block(781))
          .resolvesToOnce(block(796))
          .resolvesToOnce(block(804))
          .resolvesToOnce(block(800))
          .resolvesToOnce(block(802))
          .resolvesToOnce(block(801)),
      })

      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(10)
    })

    it('calls other client when there are errors', async () => {
      const client = mockObject<BlockClient>({
        getLatestBlockNumber: async () => 1000,
        getBlockWithTransactions: mockFn()
          .resolvesToOnce(block(500))
          .rejectsWith(new Error('error')),
      })

      const client2 = mockObject<BlockClient>({
        getLatestBlockNumber: async () => 1000,
        getBlockWithTransactions: mockFn()
          .resolvesToOnce(block(500))
          .resolvesToOnce(block(750))
          .resolvesToOnce(block(875))
          .resolvesToOnce(block(812))
          .resolvesToOnce(block(781))
          .resolvesToOnce(block(796))
          .resolvesToOnce(block(804))
          .resolvesToOnce(block(800))
          .resolvesToOnce(block(802))
          .resolvesToOnce(block(801)),
      })

      const provider = new BlockProvider('chain', [client, client2])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client.getBlockWithTransactions).toHaveBeenCalledTimes(2)
      expect(client2.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client2.getBlockWithTransactions).toHaveBeenCalledTimes(10)
    })

    it('throws error when run out of fallbacks', async () => {
      const client = mockObject<BlockClient>({
        getLatestBlockNumber: mockFn().rejectsWith(new Error('1')),
      })
      const client2 = mockObject<BlockClient>({
        getLatestBlockNumber: mockFn().rejectsWith(new Error('2')),
      })
      const client3 = mockObject<BlockClient>({
        getLatestBlockNumber: mockFn().rejectsWith(new Error('3')),
      })

      const provider = new BlockProvider('chain', [client, client2, client3])

      await expect(
        async () => await provider.getBlockNumberAtOrBefore(UnixTime(800)),
      ).toBeRejectedWith('3')

      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client2.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client3.getLatestBlockNumber).toHaveBeenCalledTimes(1)
    })
  })
})

function block(x: number) {
  return {
    number: x,
    transactions: [],
    hash: '0x' + x.toString(),
    logsBloom: `0x${'0'.repeat(512)}`,
    timestamp: x * 100,
  }
}
