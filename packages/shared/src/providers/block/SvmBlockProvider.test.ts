import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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

      expect(client.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(result).toEqual(svmBlock(1))
    })

    it('calls other client when there are errors', async () => {
      const client_one = mockObject<SvmBlockClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const client_two = mockObject<SvmBlockClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
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

      expect(client_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(client_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(client_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)

      expect(result).toEqual(svmBlock(1))
    })

    it('throws when ran out of fallbacks', async () => {
      const client_one = mockObject<SvmBlockClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const client_two = mockObject<SvmBlockClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const client_three = mockObject<SvmBlockClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error('ERROR')),
      })

      const provider = new SvmBlockProvider('chain', [
        client_one,
        client_two,
        client_three,
      ])

      await expect(() => provider.getBlockWithTransactions(1)).toBeRejectedWith(
        'ERROR',
      )

      expect(client_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(client_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(client_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    })
  })

  describe(SvmBlockProvider.prototype.getSlotNumberAtOrBefore.name, () => {
    it('uses bisection to get closest slot number to given timestamp', async () => {
      const client = mockObject<SvmBlockClient>({
        getLatestSlotNumber: async () => 1000,
        getSlotTime: mockFn()
          .resolvesToOnce({ timestamp: 50000 })
          .resolvesToOnce({ timestamp: 75000 })
          .resolvesToOnce({ timestamp: 87500 })
          .resolvesToOnce({ timestamp: 81200 })
          .resolvesToOnce({ timestamp: 78100 })
          .resolvesToOnce({ timestamp: 79600 })
          .resolvesToOnce({ timestamp: 80400 })
          .resolvesToOnce({ timestamp: 80000 })
          .resolvesToOnce({ timestamp: 80200 })
          .resolvesToOnce({ timestamp: 80100 }),
      })

      const provider = new SvmBlockProvider('chain', [client])

      const blockNumber = await provider.getSlotNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client.getSlotTime).toHaveBeenCalledTimes(10)
    })

    it('calls other client when there are errors', async () => {
      const client = mockObject<SvmBlockClient>({
        getLatestSlotNumber: async () => 1000,
        getSlotTime: mockFn()
          .resolvesToOnce({ timestamp: 500 })
          .rejectsWith(new Error('error')),
      })

      const client2 = mockObject<SvmBlockClient>({
        getLatestSlotNumber: async () => 1000,
        getSlotTime: mockFn()
          .resolvesToOnce({ timestamp: 50000 })
          .resolvesToOnce({ timestamp: 75000 })
          .resolvesToOnce({ timestamp: 87500 })
          .resolvesToOnce({ timestamp: 81200 })
          .resolvesToOnce({ timestamp: 78100 })
          .resolvesToOnce({ timestamp: 79600 })
          .resolvesToOnce({ timestamp: 80400 })
          .resolvesToOnce({ timestamp: 80000 })
          .resolvesToOnce({ timestamp: 80200 })
          .resolvesToOnce({ timestamp: 80100 }),
      })

      const provider = new SvmBlockProvider('chain', [client, client2])

      const blockNumber = await provider.getSlotNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(client.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client.getSlotTime).toHaveBeenCalledTimes(2)
      expect(client2.getLatestSlotNumber).toHaveBeenCalledTimes(1)
      expect(client2.getSlotTime).toHaveBeenCalledTimes(10)
    })

    it('throws error when run out of fallbacks', async () => {
      const client = mockObject<SvmBlockClient>({
        getLatestSlotNumber: mockFn().rejectsWith(new Error('1')),
      })
      const client2 = mockObject<SvmBlockClient>({
        getLatestSlotNumber: mockFn().rejectsWith(new Error('2')),
      })
      const client3 = mockObject<SvmBlockClient>({
        getLatestSlotNumber: mockFn().rejectsWith(new Error('3')),
      })

      const provider = new SvmBlockProvider('chain', [client, client2, client3])

      await expect(
        async () => await provider.getSlotNumberAtOrBefore(UnixTime(800 * 100)),
      ).toBeRejectedWith('3')

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
