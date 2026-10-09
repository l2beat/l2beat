import { DatabaseSync, type StatementSync } from 'node:sqlite'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import type { DiscoveryCache } from './DiscoveryCache'

const DEFAULT_DATABASE_DIR = 'cache'
const DEFAULT_DATABASE_FILENAME = 'discovery.sqlite'

export class SQLiteCache implements DiscoveryCache {
  private readonly getStatement: StatementSync
  private readonly setStatement: StatementSync

  constructor(databaseUrl?: string) {
    databaseUrl ??= `${DEFAULT_DATABASE_DIR}/${DEFAULT_DATABASE_FILENAME}`

    const databaseDir = path.dirname(databaseUrl)
    if (!existsSync(databaseDir)) {
      mkdirSync(databaseDir, { recursive: true })
    }

    const db = new DatabaseSync(databaseUrl, { timeout: 1000 })
    db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `)
    this.getStatement = db.prepare('SELECT value FROM cache WHERE key = ?')
    this.setStatement = db.prepare(`
      INSERT INTO cache(key, value)
      VALUES(?1, ?2)
      ON CONFLICT(key) DO UPDATE SET value = ?2`)
  }

  get(key: string): Promise<string | undefined> {
    try {
      const row = this.getStatement.get(key) as { value: string } | undefined
      return Promise.resolve(row?.value)
    } catch (error) {
      console.error('Error reading from cache', error)
      return Promise.resolve(undefined)
    }
  }

  set(key: string, value: string): Promise<void> {
    try {
      this.setStatement.run(key, value)
    } catch (error) {
      console.error('Error writing to cache', error)
    }
    return Promise.resolve()
  }
}
