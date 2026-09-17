import type { VoyagerClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { StarknetDayProvider } from './StarknetDayProvider'

describe(StarknetDayProvider.name, () => {
  describe(StarknetDayProvider.prototype.getDailyTxsCount.name, () => {
    it('fetches and filters daily txs within range (from inclusive, to exclusive)', async () => {
      const voyagerClient = {
        getDailyTxs: vi.fn().mockResolvedValue({
          [1 * UnixTime.DAY]: 100,
          [2 * UnixTime.DAY]: 200,
          [3 * UnixTime.DAY]: 300,
          [4 * UnixTime.DAY]: 400,
          [5 * UnixTime.DAY]: 500,
        }),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(2, 5)

      expect(result).toStrictEqual({
        [2 * UnixTime.DAY]: 200,
        [3 * UnixTime.DAY]: 300,
        [4 * UnixTime.DAY]: 400,
      })
      expect(voyagerClient.getDailyTxs).toHaveBeenCalledTimes(1)
    })

    it('returns empty object when no data in range', async () => {
      const voyagerClient = {
        getDailyTxs: vi.fn().mockResolvedValue({
          [1 * UnixTime.DAY]: 100,
          [2 * UnixTime.DAY]: 200,
        }),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(5, 10)

      expect(result).toStrictEqual({})
    })

    it('handles empty response from client', async () => {
      const voyagerClient = {
        getDailyTxs: vi.fn().mockResolvedValue({}),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(1, 5)

      expect(result).toStrictEqual({})
    })
  })

  describe(StarknetDayProvider.prototype.getDailyUopsCount.name, () => {
    it('fetches and filters daily uops within range (from inclusive, to exclusive)', async () => {
      const voyagerClient = {
        getDailyUops: vi.fn().mockResolvedValue({
          [1 * UnixTime.DAY]: 50,
          [2 * UnixTime.DAY]: 150,
          [3 * UnixTime.DAY]: 250,
          [4 * UnixTime.DAY]: 350,
          [5 * UnixTime.DAY]: 450,
        }),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyUopsCount(2, 5)

      expect(result).toStrictEqual({
        [2 * UnixTime.DAY]: 150,
        [3 * UnixTime.DAY]: 250,
        [4 * UnixTime.DAY]: 350,
      })
      expect(voyagerClient.getDailyUops).toHaveBeenCalledTimes(1)
    })

    it('returns empty object when no data in range', async () => {
      const voyagerClient = {
        getDailyUops: vi.fn().mockResolvedValue({
          [1 * UnixTime.DAY]: 50,
          [2 * UnixTime.DAY]: 150,
        }),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyUopsCount(5, 10)

      expect(result).toStrictEqual({})
    })

    it('handles empty response from client', async () => {
      const voyagerClient = {
        getDailyUops: vi.fn().mockResolvedValue({}),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyUopsCount(1, 5)

      expect(result).toStrictEqual({})
    })
  })

  describe('edge cases', () => {
    it('handles single day range', async () => {
      const voyagerClient = {
        getDailyTxs: vi.fn().mockResolvedValue({
          [1 * UnixTime.DAY]: 100,
          [2 * UnixTime.DAY]: 200,
        }),
      } as unknown as VoyagerClient

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(1, 1)

      expect(result).toStrictEqual({})
    })
  })
})
