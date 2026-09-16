import { assert } from '@l2beat/shared-pure'
import { existsSync, unlinkSync } from 'fs'
import sqlite3 from 'sqlite3'
import { describe, expect, it } from 'vitest'
import { SQLiteCache } from './SQLiteCache'

describe('SQLiteCache', () => {
  it('inserts new cache entry ', () =>
    withTemporaryFile(async (sqlCache, rqe) => {
      const key = 'key'
      const value = 'value'

      await sqlCache.set(key, value)
      const queriedValue = await sqlCache.get(key)

      const resultRaw = await rqe.query<CacheEntry[]>(
        'SELECT * FROM cache WHERE key=$1',
        [key],
      )

      const [result] = resultRaw

      assert(result)

      // Interface
      expect(queriedValue).toStrictEqual(value)

      // Raw
      expect(result.key).toStrictEqual(key)
      expect(result.value).toStrictEqual(value)
    }))

  it('replaces old value in case of conflict', () =>
    withTemporaryFile(async (sqlCache, rqe) => {
      const key = 'key'
      const value = 'value'

      const newValue = 'newValue'

      await sqlCache.set(key, value)

      await sqlCache.set(key, newValue)

      const resultRaw = await rqe.query<CacheEntry[]>(
        'SELECT * FROM cache WHERE key=$1',
        [key],
      )

      const [result] = resultRaw

      assert(result)

      expect(resultRaw.length).toStrictEqual(1)
      expect(result.key).toStrictEqual(key)
      expect(result.value).toStrictEqual(newValue)
    }))
})

interface CacheEntry {
  key: string
  value: string
  chain: string
  blockNumber: number
}

function randomSqlFile(): string {
  return `${Math.random().toString(36).substring(7)}.sqlite`
}

function destroyFile(file: string) {
  if (existsSync(file)) {
    unlinkSync(file)
  }
}

// Even if test fails miserably, it will still destroy the file despite the outcome
async function withTemporaryFile<T>(
  fn: (sqlCache: SQLiteCache, rawQueryExecutor: RawQueryExecutor) => Promise<T>,
): Promise<T> {
  const file = randomSqlFile()
  const sqlCache = new SQLiteCache(file)
  const rqe = rawQueryExecutor(file)

  return fn(sqlCache, rqe).finally(() => destroyFile(file))
}

// Just for the sake of out-of-interface testing
type RawQueryExecutor = ReturnType<typeof rawQueryExecutor>

function rawQueryExecutor(url: string) {
  const db = new sqlite3.Database(url)

  const query = async <T>(query: string, params: any[] = []): Promise<T> =>
    new Promise((resolve, reject) => {
      db.all(query, params, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result as T)
        }
      })
    })

  return { query }
}
