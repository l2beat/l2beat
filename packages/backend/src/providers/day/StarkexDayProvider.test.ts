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

    it('aggregates correctly with three products', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn()
          .resolvesToOnce(100) // product1, day 1
          .resolvesToOnce(200) // product2, day 1
          .resolvesToOnce(300), // product3, day 1
      })

      const provider = new StarkexDayProvider(starkexClient, [
        'product1',
        'product2',
        'product3',
      ])
      const result = await provider.getDailyTxsCount(1, 2)

      expect(result).toEqual({
        [1 * UnixTime.DAY]: 600, // 100 + 200 + 300
      })
      expect(starkexClient.getDailyCount).toHaveBeenCalledTimes(3)
    })

    it('processes multiple days correctly', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn()
          // Day 1
          .resolvesToOnce(10)
          .resolvesToOnce(20)
          // Day 2
          .resolvesToOnce(30)
          .resolvesToOnce(40)
          // Day 3
          .resolvesToOnce(50)
          .resolvesToOnce(60),
      })

      const provider = new StarkexDayProvider(starkexClient, ['p1', 'p2'])
      const result = await provider.getDailyTxsCount(1, 4)

      expect(result).toEqual({
        [1 * UnixTime.DAY]: 30, // 10 + 20
        [2 * UnixTime.DAY]: 70, // 30 + 40
        [3 * UnixTime.DAY]: 110, // 50 + 60
      })
      expect(starkexClient.getDailyCount).toHaveBeenCalledTimes(6)
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

    it('handles large day numbers', async () => {
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn().resolvesTo(1000),
      })

      const provider = new StarkexDayProvider(starkexClient, ['product1'])
      const largeDay = 1000000
      const result = await provider.getDailyTxsCount(largeDay, largeDay + 1)

      expect(result).toEqual({
        [largeDay * UnixTime.DAY]: 1000,
      })
      expect(starkexClient.getDailyCount).toHaveBeenCalledWith(
        largeDay,
        'product1',
      )
    })

    it('maintains correct order of calls for multiple products', async () => {
      const calls: string[] = []
      const starkexClient = mockObject<StarkexClient>({
        getDailyCount: mockFn((day: number, product: string) => {
          calls.push(`day${day}-${product}`)
          return Promise.resolve(1)
        }),
      })

      const provider = new StarkexDayProvider(starkexClient, ['p1', 'p2', 'p3'])
      await provider.getDailyTxsCount(1, 3)

      // Each day should process all products before moving to next day
      expect(calls).toEqual([
        'day1-p1',
        'day1-p2',
        'day1-p3',
        'day2-p1',
        'day2-p2',
        'day2-p3',
      ])
    })
  })
})
