import { createTokenDatabase, type TokenDatabase } from '@l2beat/database'
import type { Config } from '../config/Config'

let db: TokenDatabase | undefined

export function getDb(config: Config) {
  if (!db) {
    db = createTokenDatabase(config.database)
  }
  return db
}
