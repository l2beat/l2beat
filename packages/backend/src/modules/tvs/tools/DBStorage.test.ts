import { Logger } from '@l2beat/backend-tools'
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
        Logger.SILENT,
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

      const prices = (storage as any).prices
      expect(prices.size).toEqual(2)
      expect(prices.get(timestamp1)?.get(configId1)).toEqual(1000)
      expect(prices.get(timestamp1)?.get(configId2)).toEqual(20000)
      expect(prices.get(timestamp2)?.get(configId1)).toEqual(1100)
      expect(prices.get(timestamp2)?.get(configId2)).toEqual(21000)
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
        Logger.SILENT,
      )

      await storage.preloadPrices([configId], [timestamp])

      const prices = (storage as any).prices
      expect(prices.size).toEqual(1)
      expect(prices.get(timestamp)?.size).toEqual(0)
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
        Logger.SILENT,
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

      const amounts = (storage as any).amounts
      expect(amounts.size).toEqual(2)
      expect(amounts.get(timestamp1)?.get(configId1)).toEqual(100n)
      expect(amounts.get(timestamp1)?.get(configId2)).toEqual(200n)
      expect(amounts.get(timestamp2)?.get(configId1)).toEqual(300n)
      expect(amounts.get(timestamp2)?.get(configId2)).toEqual(400n)
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
        Logger.SILENT,
      )

      await storage.preloadAmounts([configId], [timestamp])

      const amounts = (storage as any).amounts
      expect(amounts.size).toEqual(1)
      expect(amounts.get(timestamp)?.size).toEqual(0)
    })
  })

  describe(DBStorage.prototype.getPrice.name, () => {
    it('returns price from memory when available', async () => {
      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      const storage = new DBStorage({} as Database, Logger.SILENT)
      ;(storage as any).prices = new Map([
        [timestamp, new Map([[configId, 1000]])],
      ])

      const result = await storage.getPrice(configId, timestamp)

      expect(result).toEqual(1000)
    })

    it('fetches price from DB when not in memory', async () => {
      const timestamp = UnixTime(100)
      const latestTimestamp = UnixTime(50)
      const configId = 'config1'.repeat(2)

      const dbPrice = {
        configurationId: configId,
        timestamp: latestTimestamp,
        priceId: 'eth',
        priceUsd: 900,
      }

      const tvsPrice = mockObject<Database['tvsPrice']>({
        getPrice: mockFn().resolvesTo(dbPrice),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsPrice,
        }),
        Logger.SILENT,
      )
      ;(storage as any).prices = new Map([[timestamp, new Map()]])

      const result = await storage.getPrice(configId, timestamp)

      expect(result).toEqual(900)
      expect(tvsPrice.getPrice).toHaveBeenCalledWith(configId, timestamp)
    })

    it('returns undefined when not in memory and preloadOnly is set', async () => {
      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      const tvsPrice = mockObject<Database['tvsPrice']>({
        getPrice: mockFn().resolvesTo(undefined),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsPrice,
        }),
        Logger.SILENT,
        true,
      )
      ;(storage as any).prices = new Map([[timestamp, new Map()]])

      const result = await storage.getPrice(configId, timestamp)

      expect(result).toEqual(undefined)
      expect(tvsPrice.getPrice).not.toHaveBeenCalled()
    })

    it('falls back to latest price when not in memory and not in DB', async () => {
      const timestamp = UnixTime(100)
      const latestTimestamp = UnixTime(50)
      const configId = 'config1'.repeat(2)

      const fallbackPrice = {
        configurationId: configId,
        timestamp: latestTimestamp,
        priceId: 'eth',
        priceUsd: 900,
      }

      const tvsPrice = mockObject<Database['tvsPrice']>({
        getPrice: mockFn().resolvesTo(undefined),
        getLatestPriceBefore: mockFn().resolvesTo(fallbackPrice),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsPrice,
        }),
        Logger.SILENT,
      )
      ;(storage as any).prices = new Map([[timestamp, new Map()]])

      const result = await storage.getPrice(configId, timestamp)

      expect(result).toEqual(900)
      expect(tvsPrice.getLatestPriceBefore).toHaveBeenCalledWith(
        configId,
        timestamp,
      )
    })
  })

  describe(DBStorage.prototype.getAmount.name, () => {
    it('returns amount from memory when available', async () => {
      const timestamp = UnixTime(100)
      const configId = 'config1'.repeat(2)

      const storage = new DBStorage({} as Database, Logger.SILENT)
      ;(storage as any).amounts = new Map([
        [timestamp, new Map([[configId, 100n]])],
      ])

      const result = await storage.getAmount(configId, timestamp)

      expect(result).toEqual(100n)
    })

    it('fetches amount from DB when not in memory', async () => {
      const timestamp = UnixTime(100)
      const latestTimestamp = UnixTime(50)
      const configId = 'config1'.repeat(2)

      const dbAmount = {
        configurationId: configId,
        timestamp: latestTimestamp,
        project: 'project1',
        amount: 200n,
      }

      const tvsAmount = mockObject<Database['tvsAmount']>({
        getAmount: mockFn().resolvesTo(dbAmount),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsAmount,
        }),
        Logger.SILENT,
      )
      ;(storage as any).amounts = new Map([[timestamp, new Map()]])

      const result = await storage.getAmount(configId, timestamp)

      expect(result).toEqual(200n)
      expect(tvsAmount.getAmount).toHaveBeenCalledWith(configId, timestamp)
    })

    it('falls back to latest amount when not in memory and not in DB', async () => {
      const timestamp = UnixTime(100)
      const latestTimestamp = UnixTime(50)
      const configId = 'config1'.repeat(2)

      const fallbackAmount = {
        configurationId: configId,
        timestamp: latestTimestamp,
        project: 'project1',
        amount: 200n,
      }

      const tvsAmount = mockObject<Database['tvsAmount']>({
        getAmount: mockFn().resolvesTo(undefined),
        getLatestAmountBefore: mockFn().resolvesTo(fallbackAmount),
      })

      const storage = new DBStorage(
        mockObject<Database>({
          tvsAmount,
        }),
        Logger.SILENT,
      )
      ;(storage as any).amounts = new Map([[timestamp, new Map()]])

      const result = await storage.getAmount(configId, timestamp)

      expect(result).toEqual(200n)
      expect(tvsAmount.getLatestAmountBefore).toHaveBeenCalledWith(
        configId,
        timestamp,
      )
    })
  })
})
