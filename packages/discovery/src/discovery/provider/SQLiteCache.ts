import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3' // SQLite Client
import type { DiscoveryCache } from './DiscoveryCache'

const DEFAULT_DATABASE_DIR = 'cache'
const DEFAULT_DATABASE_FILENAME = 'discovery.sqlite'

export class SQLiteCache implements DiscoveryCache {
  private readonly db: sqlite3.Database
  private initialized = false

  constructor(databaseUrl?: string) {
    databaseUrl ??= `${DEFAULT_DATABASE_DIR}/${DEFAULT_DATABASE_FILENAME}`

    const databaseDir = path.dirname(databaseUrl)
    if (!existsSync(databaseDir)) {
      mkdirSync(databaseDir, { recursive: true })
    }

    this.db = new sqlite3.Database(databaseUrl)
  }

  async get(key: string): Promise<string | undefined> {
    await this.init()

    try {
      const result = (await this.query('SELECT value FROM cache WHERE key=$1', [
        key,
      ])) as { value: string }[]
      return result[0]?.value
    } catch (error) {
      console.error('Error reading from cache', error)
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.init()

    try {
      await this.query(
        `
        INSERT INTO cache(key, value)
        VALUES($1, $2)
        ON CONFLICT(key) DO UPDATE SET value=$2`,
        [key, value],
      )
    } catch (error) {
      console.error('Error writing to cache', error)
    }
  }

  private async init(): Promise<void> {
    if (this.initialized) {
      return
    }

    await this.query(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `)
    this.initialized = true
  }

  private query(query: string, values?: unknown[]): Promise<unknown[]> {
    return new Promise<unknown[]>((resolve, reject) => {
      this.db.all(query, values, (err: Error | null, rows: unknown[]) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }
}
