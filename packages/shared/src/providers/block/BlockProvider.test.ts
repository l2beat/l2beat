import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { BlockClient, RpcClient } from '../../clients'
import { BlockProvider } from './BlockProvider'

describe(BlockProvider.name, () => {
  describe(BlockProvider.prototype.getBlockWithTransactions.name, () => {
    it('returns block', async () => {
      const rpc = {
        getBlockWithTransactions: vi.fn(async () => block(1)),
      } as unknown as RpcClient
      const provider = new BlockProvider('chain', [rpc])

      const result = await provider.getBlockWithTransactions(1)

      expect(rpc.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(1)
      expect(result).toEqual(block(1))
    })

    it('calls other client when there are errors', async () => {
      const rpc_one = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as RpcClient
      const rpc_two = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as RpcClient
      const rpc_three = {
        getBlockWithTransactions: vi.fn(async () => block(1)),
      } as unknown as RpcClient

      const provider = new BlockProvider('chain', [rpc_one, rpc_two, rpc_three])

      const result = await provider.getBlockWithTransactions(1)

      expect(rpc_one.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(
        1,
      )
      expect(rpc_two.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(
        1,
      )
      expect(
        rpc_three.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)

      expect(result).toEqual(block(1))
    })

    it('throws when ran out of fallbacks', async () => {
      const rpc_one = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as RpcClient
      const rpc_two = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as RpcClient
      const rpc_three = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error('ERROR')),
      } as unknown as RpcClient

      const provider = new BlockProvider('chain', [rpc_one, rpc_two, rpc_three])

      await expect(() => provider.getBlockWithTransactions(1)).rejects.toThrow(
        'ERROR',
      )

      expect(rpc_one.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(
        1,
      )
      expect(rpc_two.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(
        1,
      )
      expect(
        rpc_three.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)
    })
  })

  describe(BlockProvider.prototype.getBlockNumberAtOrBefore.name, () => {
    it('finds the closest block number to given timestamp', async () => {
      const client = {
        getLatestBlockNumber: vi.fn(async () => 1000),
        getBlockTimestamp: undefined,
        getBlockWithTransactions: vi.fn(async (n: number) => block(n)),
      } as unknown as BlockClient

      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toBe(800)
      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
    })

    it('probes timestamps without transaction bodies when the client supports it', async () => {
      const getBlockTimestamp = vi.fn(async (n: number) => n * 100)
      const client = {
        getLatestBlockNumber: vi.fn(async () => 1000),
        getBlockTimestamp,
        getBlockWithTransactions: vi.fn(),
      } as unknown as BlockClient

      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toBe(800)
      expect(getBlockTimestamp).toHaveBeenCalled()
      expect(client.getBlockWithTransactions).not.toHaveBeenCalled()
    })

    it('calls other client when there are errors', async () => {
      const client = {
        getLatestBlockNumber: vi.fn(async () => 1000),
        getBlockTimestamp: undefined,
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error('error')),
      } as unknown as BlockClient

      const client2 = {
        getLatestBlockNumber: vi.fn(async () => 1000),
        getBlockTimestamp: undefined,
        getBlockWithTransactions: vi.fn(async (n: number) => block(n)),
      } as unknown as BlockClient

      const provider = new BlockProvider('chain', [client, client2])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toBe(800)
      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
      expect(client2.getLatestBlockNumber).toHaveBeenCalledTimes(1)
    })

    it('falls back to 0 when start is above client latest', async () => {
      const client = {
        getLatestBlockNumber: vi.fn(async () => 500),
        getBlockTimestamp: undefined,
        getBlockWithTransactions: vi.fn(async (n: number) => block(n)),
      } as unknown as BlockClient

      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(300 * 100),
        800,
      )

      expect(blockNumber).toBe(300)
      expect(client.getLatestBlockNumber).toHaveBeenCalledTimes(1)
    })

    it('throws error when run out of fallbacks', async () => {
      const client = {
        getLatestBlockNumber: vi.fn().mockRejectedValue(new Error('1')),
      } as unknown as BlockClient
      const client2 = {
        getLatestBlockNumber: vi.fn().mockRejectedValue(new Error('2')),
      } as unknown as BlockClient
      const client3 = {
        getLatestBlockNumber: vi.fn().mockRejectedValue(new Error('3')),
      } as unknown as BlockClient

      const provider = new BlockProvider('chain', [client, client2, client3])

      await expect(
        async () => await provider.getBlockNumberAtOrBefore(UnixTime(800)),
      ).rejects.toThrow('3')

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
