import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { SvmBlock, SvmBlockClient } from '../../clients'
import { SvmBlockProvider } from './SvmBlockProvider'

describe(SvmBlockProvider.name, () => {
  describe(SvmBlockProvider.prototype.getBlockWithTransactions.name, () => {
    it('returns block', async () => {
      const client = mockObject<SvmBlockClient>({
        getBlockWithTransactions: async () => svmBlock(1),
      })
      const provider = new SvmBlockProvider('chain', [client])

      const result = await provider.getBlockWithTransactions(1)

      expect(client.getBlockWithTransactions).toHaveBeenCalledExactlyOnceWith(1)
      expect(result).toStrictEqual(svmBlock(1))
    })

    it('calls other client when there are errors', async () => {
      const client_one = mockObject<SvmBlockClient>({
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      })
      const client_two = mockObject<SvmBlockClient>({
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      })
      const client_three = mockObject<SvmBlockClient>({
        getBlockWithTransactions: async () => svmBlock(1),
      })

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

      expect(result).toStrictEqual(svmBlock(1))
    })

    it('throws when ran out of fallbacks', async () => {
      const client_one = mockObject<SvmBlockClient>({
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      })
      const client_two = mockObject<SvmBlockClient>({
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error()),
      })
      const client_three = mockObject<SvmBlockClient>({
        getBlockWithTransactions: vi.fn().mockRejectedValue(new Error('ERROR')),
      })

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
      const client = mockObject<SvmBlockClient>({
        getLatestSlotNumber: async () => 1000,
        getSlotTime: async (n: number) => ({ timestamp: n * 100 }),
      })

      const provider = new SvmBlockProvider('chain', [client])

      const blockNumber = await provider.getSlotNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toStrictEqual(800)
      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
    })

    it('calls other client when there are errors', async () => {
      const client = mockObject<SvmBlockClient>({
        getLatestSlotNumber: async () => 1000,
        getSlotTime: vi.fn().mockRejectedValue(new Error('error')),
      })

      const client2 = mockObject<SvmBlockClient>({
        getLatestSlotNumber: async () => 1000,
        getSlotTime: async (n: number) => ({ timestamp: n * 100 }),
      })

      const provider = new SvmBlockProvider('chain', [client, client2])

      const blockNumber = await provider.getSlotNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toStrictEqual(800)
      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client2.getLatestSlotNumber).toHaveBeenCalledTimes(1)
    })

    it('throws error when run out of fallbacks', async () => {
      const client = mockObject<SvmBlockClient>({
        getLatestSlotNumber: vi.fn().mockRejectedValue(new Error('1')),
      })
      const client2 = mockObject<SvmBlockClient>({
        getLatestSlotNumber: vi.fn().mockRejectedValue(new Error('2')),
      })
      const client3 = mockObject<SvmBlockClient>({
        getLatestSlotNumber: vi.fn().mockRejectedValue(new Error('3')),
      })

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
