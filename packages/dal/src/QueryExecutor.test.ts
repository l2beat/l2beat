import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Cache } from './cache/Cache'
import { QueryExecutor } from './QueryExecutor'
import type { Query, QueryResult } from './queries'

describe(QueryExecutor.name, () => {
  const testKey = 'test-key'
  describe(QueryExecutor.prototype.execute.name, () => {
    const mockDb = mockObject<Database>({})

    it('should return cached data when cache hit occurs', async () => {
      const cachedData: QueryResult<'getTestQuery'> = [
        { projectId: ProjectId.ETHEREUM, timestamp: 1234567890, value: 100 },
      ]
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo({ data: cachedData }),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTestQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      const result = await queryExecutor.execute(query)

      expect(mockCache.generateKey).toHaveBeenCalledWith('getTestQuery', [
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
        name: 'getTestQuery',
        args: [[ProjectId.ETHEREUM]],
      }
      const dbResult: QueryResult<'getTestQuery'> = [
        { projectId: ProjectId.ETHEREUM, timestamp: 1234567890, value: 100 },
      ]

      const mockExecuteRawQuery = mockFn().resolvesTo(dbResult)
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      const result = await queryExecutor.execute(query, 120)

      expect(mockCache.generateKey).toHaveBeenCalledWith('getTestQuery', [
        [ProjectId.ETHEREUM],
      ])
      expect(mockCache.read).toHaveBeenCalledWith(testKey)
      expect(mockExecuteRawQuery).toHaveBeenCalledWith(query)
      expect(mockCache.write).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(dbResult),
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
        name: 'getTestQuery',
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
        name: 'getTestQuery',
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
        name: 'getTestQuery',
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
        name: 'getTestQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      await expect(queryExecutor.execute(query)).toBeRejectedWith(
        'Cache read failed',
      )
      expect(mockCache.generateKey).toHaveBeenCalledWith('getTestQuery', [
        [ProjectId.ETHEREUM],
      ])
      expect(mockCache.read).toHaveBeenCalledWith(testKey)
    })

    it('should reuse in-flight query when multiple requests come simultaneously', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().resolvesTo(undefined),
      })
      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const dbResult: QueryResult<'getTestQuery'> = [
        { projectId: ProjectId.ETHEREUM, timestamp: 1234567890, value: 100 },
      ]
      const mockExecuteRawQuery = mockFn().resolvesTo(dbResult)
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      const query: Query = {
        name: 'getTestQuery',
        args: [[ProjectId.ETHEREUM]],
      }

      const [res1, res2, res3] = await Promise.all([
        queryExecutor.execute(query),
        queryExecutor.execute(query),
        queryExecutor.execute(query),
      ])

      expect(mockExecuteRawQuery).toHaveBeenCalledTimes(1)
      expect(res1).toEqual(dbResult)
      expect(res2).toEqual(dbResult)
      expect(res3).toEqual(dbResult)
      expect(mockCache.write).toHaveBeenCalledTimes(1)
    })

    it('should not reuse in-flight query when timestamp is too old', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTestQuery',
        args: [[ProjectId.ETHEREUM]],
      }
      const dbResult1: QueryResult<'getTestQuery'> = [
        { projectId: ProjectId.ETHEREUM, timestamp: 1234567890, value: 100 },
      ]
      const dbResult2: QueryResult<'getTestQuery'> = [
        { projectId: ProjectId.ETHEREUM, timestamp: 1234567890, value: 200 },
      ]

      // Mock Date.now to control time
      const originalDateNow = Date.now
      let currentTime = 1000000
      Date.now = () => currentTime

      const mockExecuteRawQuery = mockFn()
        .resolvesToOnce(dbResult1)
        .resolvesToOnce(dbResult2)
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      // First request
      const result1 = await queryExecutor.execute(query)

      // Advance time beyond PROMISE_TIMEOUT (30 seconds)
      currentTime += 31_000

      // Second request should not reuse in-flight query
      const result2 = await queryExecutor.execute(query)

      // Restore Date.now
      Date.now = originalDateNow

      expect(mockExecuteRawQuery).toHaveBeenCalledTimes(2)
      expect(result1).toEqual(dbResult1)
      expect(result2).toEqual(dbResult2)
    })

    it('should remove in-flight entry after query completes', async () => {
      const mockCache = mockObject<Cache>({
        generateKey: mockFn().returns(testKey),
        read: mockFn().resolvesTo(undefined),
        write: mockFn().resolvesTo(undefined),
      })

      const queryExecutor = new QueryExecutor(mockDb, Logger.SILENT, mockCache)
      const query: Query = {
        name: 'getTestQuery',
        args: [[ProjectId.ETHEREUM]],
      }
      const dbResult: QueryResult<'getTestQuery'> = [
        { projectId: ProjectId.ETHEREUM, timestamp: 1234567890, value: 100 },
      ]

      const mockExecuteRawQuery = mockFn()
        .resolvesToOnce(dbResult)
        .resolvesToOnce(dbResult)
      queryExecutor.executeRawQuery = mockExecuteRawQuery

      // First request
      await queryExecutor.execute(query)

      // Second request should not reuse in-flight query since first one completed
      await queryExecutor.execute(query)

      expect(mockExecuteRawQuery).toHaveBeenCalledTimes(2)
    })
  })
})
