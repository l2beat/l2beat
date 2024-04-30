import { existsSync, mkdirSync } from 'fs'
import sqlite3 from 'sqlite3' // SQLite Client

import { DiscoveryCache } from './ProviderWithCache'

const DEFAULT_DATABASE_DIR = 'cache'
const DEFAULT_DATABASE_FILENAME = 'discovery.sqlite'

export class SQLiteCache implements DiscoveryCache {
  private readonly db: sqlite3.Database

  constructor(databaseUrl?: string) {
    if (databaseUrl === undefined) {
      if (!existsSync(DEFAULT_DATABASE_DIR)) {
        mkdirSync(DEFAULT_DATABASE_DIR, { recursive: true })
      }
      databaseUrl = `${DEFAULT_DATABASE_DIR}/${DEFAULT_DATABASE_FILENAME}`
    }
    this.db = new sqlite3.Database(databaseUrl)
  }

  async init(): Promise<void> {
    await this.query(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        blockNumber INTEGER,
        chain TEXT,
        value TEXT
      )
    `)
  }

  async get(key: string): Promise<string | undefined> {
    try {
      const result = (await this.query('SELECT value FROM cache WHERE key=$1', [
        key,
      ])) as { value: string }[]
      return result[0]?.value
    } catch (error) {
      console.error('Error reading from cache', error)
    }
  }

  async set(
    key: string,
    value: string,
    chain: string,
    blockNumber: number | undefined,
  ): Promise<void> {
    try {
      await this.query(
        `
        INSERT INTO cache(key, value, chain, blockNumber) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT(key) DO UPDATE SET value=$2, chain=$3, blockNumber=$4`,
        [key, value, chain, blockNumber],
      )
    } catch (error) {
      console.error('Error writing to cache', error)
    }
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
