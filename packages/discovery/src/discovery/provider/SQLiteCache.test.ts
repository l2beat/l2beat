import { DatabaseSync } from 'node:sqlite'
import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { existsSync, unlinkSync } from 'fs'
import { SQLiteCache } from './SQLiteCache'

describe('SQLiteCache', () => {
  it('inserts new cache entry ', () =>
    withTemporaryFile(async (sqlCache, db) => {
      const key = 'key'
      const value = 'value'

      await sqlCache.set(key, value)
      const queriedValue = await sqlCache.get(key)

      const resultRaw = db
        .prepare('SELECT * FROM cache WHERE key = ?')
        .all(key) as unknown as CacheEntry[]

      const [result] = resultRaw

      assert(result)

      // Interface
      expect(queriedValue).toEqual(value)

      // Raw
      expect(result.key).toEqual(key)
      expect(result.value).toEqual(value)
    }))

  it('replaces old value in case of conflict', () =>
    withTemporaryFile(async (sqlCache, db) => {
      const key = 'key'
      const value = 'value'

      const newValue = 'newValue'

      await sqlCache.set(key, value)

      await sqlCache.set(key, newValue)

      const resultRaw = db
        .prepare('SELECT * FROM cache WHERE key = ?')
        .all(key) as unknown as CacheEntry[]

      const [result] = resultRaw

      assert(result)

      expect(resultRaw.length).toEqual(1)
      expect(result.key).toEqual(key)
      expect(result.value).toEqual(newValue)
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
  fn: (sqlCache: SQLiteCache, db: DatabaseSync) => Promise<T>,
): Promise<T> {
  const file = randomSqlFile()
  const sqlCache = new SQLiteCache(file)
  const db = new DatabaseSync(file)

  return fn(sqlCache, db).finally(() => {
    db.close()
    destroyFile(file)
  })
}
