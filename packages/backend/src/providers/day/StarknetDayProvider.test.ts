import type { VoyagerClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { StarknetDayProvider } from './StarknetDayProvider'

describe(StarknetDayProvider.name, () => {
  describe(StarknetDayProvider.prototype.getDailyTxsCount.name, () => {
    it('fetches and filters daily txs within range (from inclusive, to exclusive)', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyTxs: mockFn().resolvesTo({
          [1 * UnixTime.DAY]: 100,
          [2 * UnixTime.DAY]: 200,
          [3 * UnixTime.DAY]: 300,
          [4 * UnixTime.DAY]: 400,
          [5 * UnixTime.DAY]: 500,
        }),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(2, 5)

      expect(result).toEqual({
        [2 * UnixTime.DAY]: 200,
        [3 * UnixTime.DAY]: 300,
        [4 * UnixTime.DAY]: 400,
      })
      expect(voyagerClient.getDailyTxs).toHaveBeenCalledTimes(1)
    })

    it('returns empty object when no data in range', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyTxs: mockFn().resolvesTo({
          [1 * UnixTime.DAY]: 100,
          [2 * UnixTime.DAY]: 200,
        }),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(5, 10)

      expect(result).toEqual({})
    })

    it('handles empty response from client', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyTxs: mockFn().resolvesTo({}),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(1, 5)

      expect(result).toEqual({})
    })
  })

  describe(StarknetDayProvider.prototype.getDailyUopsCount.name, () => {
    it('fetches and filters daily uops within range (from inclusive, to exclusive)', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyUops: mockFn().resolvesTo({
          [1 * UnixTime.DAY]: 50,
          [2 * UnixTime.DAY]: 150,
          [3 * UnixTime.DAY]: 250,
          [4 * UnixTime.DAY]: 350,
          [5 * UnixTime.DAY]: 450,
        }),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyUopsCount(2, 5)

      expect(result).toEqual({
        [2 * UnixTime.DAY]: 150,
        [3 * UnixTime.DAY]: 250,
        [4 * UnixTime.DAY]: 350,
      })
      expect(voyagerClient.getDailyUops).toHaveBeenCalledTimes(1)
    })

    it('returns empty object when no data in range', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyUops: mockFn().resolvesTo({
          [1 * UnixTime.DAY]: 50,
          [2 * UnixTime.DAY]: 150,
        }),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyUopsCount(5, 10)

      expect(result).toEqual({})
    })

    it('handles empty response from client', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyUops: mockFn().resolvesTo({}),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyUopsCount(1, 5)

      expect(result).toEqual({})
    })
  })

  describe('edge cases', () => {
    it('handles single day range', async () => {
      const voyagerClient = mockObject<VoyagerClient>({
        getDailyTxs: mockFn().resolvesTo({
          [1 * UnixTime.DAY]: 100,
          [2 * UnixTime.DAY]: 200,
        }),
      })

      const provider = new StarknetDayProvider(voyagerClient)
      const result = await provider.getDailyTxsCount(1, 1)

      expect(result).toEqual({})
    })
  })
})
