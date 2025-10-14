import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Cache } from './cache/Cache'
import { QueryExecutor, type QueryResultWithTimestamp } from './QueryExecutor'
import type { Query } from './queries'

describe(QueryExecutor.name, () => {
  const testKey = 'test-key'
  describe(QueryExecutor.prototype.execute.name, () => {
    const mockDb = mockObject<Database>({})

    it('should return cached data when cache hit occurs', async () => {
      const cachedData: QueryResultWithTimestamp<'getTvsChartQuery'> = {
        data: [{ timestamp: 1234567890, value: 100 }],
        timestamp: UnixTime.now(),
      }
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(cachedData),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTvsChartQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      const result = await queryExecutor.execute(query)

      expect(mockCache.generateKey).toHaveBeenCalledWith('getTvsChartQuery', [
        [ProjectId.ETHEREUM],
      ])
      expect(mockCache.read).toHaveBeenCalledWith(testKey)
      expect(result).toEqual(cachedData)
    })

    it('should query database and cache result when cache miss occurs', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTvsChartQuery',
        args: [[ProjectId.ETHEREUM]],
      }
      const dbResult: QueryResultWithTimestamp<'getTvsChartQuery'> = {
        data: [{ timestamp: 1234567890, value: 100 }],
        timestamp: UnixTime.now(),
      }

      const mockExecuteRawQuery = mockFn().resolvesTo(dbResult.data)
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      const result = await queryExecutor.execute(query, 120)

      expect(mockCache.generateKey).toHaveBeenCalledWith('getTvsChartQuery', [
        [ProjectId.ETHEREUM],
      ])
      expect(mockCache.read).toHaveBeenCalledWith(testKey)
      expect(mockExecuteRawQuery).toHaveBeenCalledWith(query)
      expect(mockCache.write).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(dbResult.data),
        120,
      )
      expect(result).toEqual(dbResult)
    })

    it('should use default expiration when not provided', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTvsChartQuery',
        args: [[ProjectId.ETHEREUM]],
      }
      const dbResult = { chart: [] }

      const mockExecuteRawQuery = mockFn().resolvesTo({ chart: [] })
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      await queryExecutor.execute(query)

      expect(mockCache.write).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(dbResult),
        60 * 30,
      )
    })

    it('should handle database errors gracefully', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTvsChartQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      const mockExecuteRawQuery = mockFn().rejectsWith(
        new Error('Database connection failed'),
      )
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      await expect(queryExecutor.execute(query)).toBeRejectedWith(
        'Database connection failed',
      )
      expect(mockCache.write).not.toHaveBeenCalled()
    })

    it('should handle cache write errors gracefully', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().rejectsWith(new Error('Cache write failed')),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTvsChartQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      const mockExecuteRawQuery = mockFn().resolvesTo({ chart: [] })
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      await expect(queryExecutor.execute(query)).toBeRejectedWith(
        'Cache write failed',
      )
      expect(mockExecuteRawQuery).toHaveBeenCalledWith(query)
    })

    it('should handle cache read errors gracefully', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().rejectsWith(new Error('Cache read failed')),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTvsChartQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      await expect(queryExecutor.execute(query)).toBeRejectedWith(
        'Cache read failed',
      )
      expect(mockCache.generateKey).toHaveBeenCalledWith('getTvsChartQuery', [
        [ProjectId.ETHEREUM],
      ])
      expect(mockCache.read).toHaveBeenCalledWith(testKey)
    })
  })
})
