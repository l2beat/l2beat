import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { SvmBlock, SvmBlockClient } from '../../clients'
import { SvmBlockProvider } from './SvmBlockProvider'

describe(SvmBlockProvider.name, () => {
  describe(SvmBlockProvider.prototype.getBlockWithTransactions.name, () => {
    it('returns block', async () => {
      const client = {
        getBlockWithTransactions: vi.fn(async () => svmBlock(1)),
      } as unknown as SvmBlockClient
      const provider = new SvmBlockProvider('chain', [client])

      const result = await provider.getBlockWithTransactions(1)

      expect(client.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(1)
      expect(result).toEqual(svmBlock(1))
    })

    it('calls other client when there are errors', async () => {
      const client_one = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as SvmBlockClient
      const client_two = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as SvmBlockClient
      const client_three = {
        getBlockWithTransactions: vi.fn(async () => svmBlock(1)),
      } as unknown as SvmBlockClient

      const provider = new SvmBlockProvider('chain', [
        client_one,
        client_two,
        client_three,
      ])

      const result = await provider.getBlockWithTransactions(1)

      expect(
        client_one.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)
      expect(
        client_two.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)
      expect(
        client_three.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)

      expect(result).toEqual(svmBlock(1))
    })

    it('throws when ran out of fallbacks', async () => {
      const client_one = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as SvmBlockClient
      const client_two = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      } as unknown as SvmBlockClient
      const client_three = {
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error('ERROR')),
      } as unknown as SvmBlockClient

      const provider = new SvmBlockProvider('chain', [
        client_one,
        client_two,
        client_three,
      ])

      await expect(() => provider.getBlockWithTransactions(1)).rejects.toThrow(
        'ERROR',
      )

      expect(
        client_one.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)
      expect(
        client_two.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)
      expect(
        client_three.getBlockWithTransactions,
      ).toHaveBeenCalledExactlyOnceWith(1)
    })
  })

  describe(SvmBlockProvider.prototype.getSlotNumberAtOrBefore.name, () => {
    it('finds the closest slot number to given timestamp', async () => {
      const client = {
        getLatestSlotNumber: vi.fn(async () => 1000),
        getSlotTime: vi.fn(async (n: number) => ({ timestamp: n * 100 })),
      } as unknown as SvmBlockClient

      const provider = new SvmBlockProvider('chain', [client])

      const blockNumber = await provider.getSlotNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
    })

    it('calls other client when there are errors', async () => {
      const client = {
        getLatestSlotNumber: vi.fn(async () => 1000),
        getSlotTime: vi.fn().mockRejectedValue(new Error('error')),
      } as unknown as SvmBlockClient

      const client2 = {
        getLatestSlotNumber: vi.fn(async () => 1000),
        getSlotTime: vi.fn(async (n: number) => ({ timestamp: n * 100 })),
      } as unknown as SvmBlockClient

      const provider = new SvmBlockProvider('chain', [client, client2])

      const blockNumber = await provider.getSlotNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client2.getLatestSlotNumber).toHaveBeenCalledTimes(1)
    })

    it('throws error when run out of fallbacks', async () => {
      const client = {
        getLatestSlotNumber: vi.fn().mockRejectedValue(new Error('1')),
      } as unknown as SvmBlockClient
      const client2 = {
        getLatestSlotNumber: vi.fn().mockRejectedValue(new Error('2')),
      } as unknown as SvmBlockClient
      const client3 = {
        getLatestSlotNumber: vi.fn().mockRejectedValue(new Error('3')),
      } as unknown as SvmBlockClient

      const provider = new SvmBlockProvider('chain', [client, client2, client3])

      await expect(
        async () => await provider.getSlotNumberAtOrBefore(UnixTime(800 * 100)),
      ).rejects.toThrow('3')

      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client2.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client3.getLatestSlotNumber).toHaveBeenCalledTimes(1)
    })
  })
})

function svmBlock(x: number) {
  return {
    number: x,
    hash: 'hash',
    timestamp: x * 100,
    transactionsCount: 1,
  } as SvmBlock
}
