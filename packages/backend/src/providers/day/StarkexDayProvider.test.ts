import type { StarkexClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { StarkexDayProvider } from './StarkexDayProvider'

describe(StarkexDayProvider.name, () => {
  describe(StarkexDayProvider.prototype.getDailyTxsCount.name, () => {
    it('fetches and aggregates daily txs for single product', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn()
          .resolvesToOnce(100) // day 2
          .resolvesToOnce(200) // day 3
          .resolvesToOnce(300), // day 4
      })

      const provider = new StarkexDayProvider(starkexClient, ['product1'])
      const result = await provider.getDailyTxsCount(2, 5)

      expect(result).toEqual({
        [2 * UnixTime.DAY]: 100,
        [3 * UnixTime.DAY]: 200,
        [4 * UnixTime.DAY]: 300,
      })
      expect(starkexClient.getDailyCount).toHaveBeenCalledTimes(3)
      expect(starkexClient.getDailyCount).toHaveBeenNthCalledWith(
        1,
        2,
        'product1',
      )
      expect(starkexClient.getDailyCount).toHaveBeenNthCalledWith(
        2,
        3,
        'product1',
      )
      expect(starkexClient.getDailyCount).toHaveBeenNthCalledWith(
        3,
        4,
        'product1',
      )
    })

    it('fetches and aggregates daily txs for multiple products', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn()
          // Day 2
          .resolvesToOnce(100) // product1
          .resolvesToOnce(50) // product2
          // Day 3
          .resolvesToOnce(200) // product1
          .resolvesToOnce(75), // product2
      })

      const provider = new StarkexDayProvider(starkexClient, [
        'product1',
        'product2',
      ])
      const result = await provider.getDailyTxsCount(2, 4)

      expect(result).toEqual({
        [2 * UnixTime.DAY]: 150, // 100 + 50
        [3 * UnixTime.DAY]: 275, // 200 + 75
      })
      expect(starkexClient.getDailyCount).toHaveBeenCalledTimes(4)
    })

    it('handles single day range (from inclusive, to exclusive)', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn().resolvesTo(100),
      })

      const provider = new StarkexDayProvider(starkexClient, ['product1'])
      const result = await provider.getDailyTxsCount(5, 5)

      expect(result).toEqual({})
      expect(starkexClient.getDailyCount).not.toHaveBeenCalled()
    })

    it('handles zero counts', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn().resolvesTo(0),
      })

      const provider = new StarkexDayProvider(starkexClient, ['product1'])
      const result = await provider.getDailyTxsCount(1, 3)

      expect(result).toEqual({
        [1 * UnixTime.DAY]: 0,
        [2 * UnixTime.DAY]: 0,
      })
    })

    it('handles API errors gracefully', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn().rejectsWithOnce(new Error('API Error')),
      })

      const provider = new StarkexDayProvider(starkexClient, ['product1'])

      await expect(provider.getDailyTxsCount(1, 2)).toBeRejected()
    })
  })

  describe(StarkexDayProvider.prototype.getDailyUopsCount.name, () => {
    it('returns empty object (API does not expose this metric)', async () => {
      const starkexClient = mockObject<StarkexClient>({})
      const provider = new StarkexDayProvider(starkexClient, ['product1'])

      const result = await provider.getDailyUopsCount(1, 10)

      expect(result).toEqual({})
    })
  })

  describe('edge cases', () => {
    it('handles empty products array', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn(),
      })

      const provider = new StarkexDayProvider(starkexClient, [])
      const result = await provider.getDailyTxsCount(1, 3)

      expect(result).toEqual({
        [1 * UnixTime.DAY]: 0,
        [2 * UnixTime.DAY]: 0,
      })
      expect(starkexClient.getDailyCount).not.toHaveBeenCalled()
    })
  })
})
