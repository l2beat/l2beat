import {
  createDatabase,
  createTokenDatabase,
  type Database,
  type TokenDatabase,
} from '@l2beat/database'
import type { Config } from '../config/Config'

let tokenDb: TokenDatabase | undefined
let db: Database | undefined

export function getTokenDb(config: Config) {
  if (!tokenDb) {
    tokenDb = createTokenDatabase(config.tokenDatabase)
  }
  return tokenDb
}

export function getDb(config: Config) {
  if (!db) {
    db = createDatabase(config.database)
  }
  return db
}
