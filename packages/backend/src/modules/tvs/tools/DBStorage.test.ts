import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { DBStorage } from './DBStorage'

describe(DBStorage.name, () => {
  describe(DBStorage.prototype.preloadPrices.name, () => {
    it('fetches prices from database and stores them in memory', async () => {
      const timestamp1 = UnixTime(100)
      const timestamp2 = UnixTime(200)
      const configId1 = 'config1'.repeat(2)
      const configId2 = 'config2'.repeat(2)

      const mockPrices = [
        {
          configurationId: configId1,
          timestamp: timestamp1,
          priceId: 'eth',
          priceUsd: 1000,
        },
        {
          configurationId: configId2,
          timestamp: timestamp1,
          priceId: 'btc',
          priceUsd: 20000,
        },
        {
          configurationId: configId1,
          timestamp: timestamp2,
          priceId: 'eth',
          priceUsd: 1100,
        },
        {
          configurationId: configId2,
          timestamp: timestamp2,
          priceId: 'btc',
          priceUsd: 21000,
        },
      ]

      const tvsPrice = mockObject<Database['tvsPrice']>({
        getPricesInRange: mockFn().resolvesTo(mockPrices),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsPrice,
        }),
      )

      await storage.preloadPrices(
        [configId1, configId2],
        [timestamp1, timestamp2],
      )

      expect(tvsPrice.getPricesInRange).toHaveBeenCalledWith(
        [configId1, configId2],
        timestamp1,
        timestamp2,
      )

      expect(storage.prices.size).toEqual(2)
      expect(storage.prices.get(timestamp1)?.get(configId1)).toEqual(1000)
      expect(storage.prices.get(timestamp1)?.get(configId2)).toEqual(20000)
      expect(storage.prices.get(timestamp2)?.get(configId1)).toEqual(1100)
      expect(storage.prices.get(timestamp2)?.get(configId2)).toEqual(21000)
    })

    it('handles empty result from database', async () => {
      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      const tvsPrice = mockObject<Database['tvsPrice']>({
        getPricesInRange: mockFn().resolvesTo([]),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsPrice,
        }),
      )

      await storage.preloadPrices([configId], [timestamp])

      expect(storage.prices.size).toEqual(1)
      expect(storage.prices.get(timestamp)?.size).toEqual(0)
    })
  })

  describe(DBStorage.prototype.preloadAmounts.name, () => {
    it('fetches amounts from database and stores them in memory', async () => {
      const timestamp1 = UnixTime(100)
      const timestamp2 = UnixTime(200)
      const configId1 = 'config1'.repeat(2)
      const configId2 = 'config2'.repeat(2)

      const mockAmounts = [
        {
          configurationId: configId1,
          timestamp: timestamp1,
          project: 'project1',
          amount: 100n,
        },
        {
          configurationId: configId2,
          timestamp: timestamp1,
          project: 'project2',
          amount: 200n,
        },
        {
          configurationId: configId1,
          timestamp: timestamp2,
          project: 'project1',
          amount: 300n,
        },
        {
          configurationId: configId2,
          timestamp: timestamp2,
          project: 'project2',
          amount: 400n,
        },
      ]

      const tvsAmount = mockObject<Database['tvsAmount']>({
        getAmountsInRange: mockFn().resolvesTo(mockAmounts),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsAmount,
        }),
      )

      await storage.preloadAmounts(
        [configId1, configId2],
        [timestamp1, timestamp2],
      )

      expect(tvsAmount.getAmountsInRange).toHaveBeenCalledWith(
        [configId1, configId2],
        timestamp1,
        timestamp2,
      )

      expect(storage.amounts.size).toEqual(2)
      expect(storage.amounts.get(timestamp1)?.get(configId1)).toEqual(100n)
      expect(storage.amounts.get(timestamp1)?.get(configId2)).toEqual(200n)
      expect(storage.amounts.get(timestamp2)?.get(configId1)).toEqual(300n)
      expect(storage.amounts.get(timestamp2)?.get(configId2)).toEqual(400n)
    })

    it('handles empty result from database', async () => {
      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      const tvsAmount = mockObject<Database['tvsAmount']>({
        getAmountsInRange: mockFn().resolvesTo([]),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsAmount,
        }),
      )

      await storage.preloadAmounts([configId], [timestamp])

      expect(storage.amounts.size).toEqual(1)
      expect(storage.amounts.get(timestamp)?.size).toEqual(0)
    })
  })

  describe(DBStorage.prototype.getPrice.name, () => {
    it('returns price from memory', async () => {
      const storage = new DBStorage({} as Database)

      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      storage.prices = new Map([[timestamp, new Map([[configId, 1000]])]])

      const result = await storage.getPrice(configId, timestamp)

      expect(result).toEqual(1000)
    })

    it('returns undefined when timestamp not found', async () => {
      const storage = new DBStorage({} as Database)

      const timestamp1 = UnixTime(100)
      const timestamp2 = UnixTime(200)
      const configId = 'config1'.repeat(2)

      storage.prices = new Map([[timestamp1, new Map([[configId, 1000]])]])

      const result = await storage.getPrice(configId, timestamp2)

      expect(result).toEqual(undefined)
    })

    it('returns undefined when config id not found', async () => {
      const storage = new DBStorage({} as Database)

      const timestamp = UnixTime(100)
      const configId1 = 'config1'.repeat(2)
      const configId2 = 'config2'.repeat(2)

      storage.prices = new Map([[timestamp, new Map([[configId1, 1000]])]])

      const result = await storage.getPrice(configId2, timestamp)

      expect(result).toEqual(undefined)
    })
  })

  describe(DBStorage.prototype.getAmount.name, () => {
    it('returns amount from memory', async () => {
      const storage = new DBStorage({} as Database)

      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      storage.amounts = new Map([[timestamp, new Map([[configId, 100n]])]])

      const result = await storage.getAmount(configId, timestamp)

      expect(result).toEqual(100n)
    })

    it('returns undefined when timestamp not found', async () => {
      const storage = new DBStorage({} as Database)

      const timestamp1 = UnixTime(100)
      const timestamp2 = UnixTime(200)
      const configId = 'config1'.repeat(2)

      storage.amounts = new Map([[timestamp1, new Map([[configId, 100n]])]])

      const result = await storage.getAmount(configId, timestamp2)

      expect(result).toEqual(undefined)
    })

    it('returns undefined when config id not found', async () => {
      const storage = new DBStorage({} as Database)

      const timestamp = UnixTime(100)
      const configId1 = 'config1'.repeat(2)
      const configId2 = 'config2'.repeat(2)

      storage.amounts = new Map([[timestamp, new Map([[configId1, 100n]])]])

      const result = await storage.getAmount(configId2, timestamp)

      expect(result).toEqual(undefined)
    })
  })
})
