import {
  compiledToSqlQuery,
  createDatabase,
  createTokenDatabase,
  type Database,
  type KyselyLogEvent,
  type TokenDatabase,
} from '@l2beat/database'
import type { Config } from '../config/Config'
import { getLogger } from '../logger'

let tokenDb: TokenDatabase | undefined
let db: Database | undefined

export function getTokenDb(config: Config) {
  if (!tokenDb) {
    tokenDb = createTokenDatabase({
      ...config.tokenDatabase.pool,
      log: config.tokenDatabase.logsEnabled
        ? makeDbLogger('TokenDatabase')
        : undefined,
    })
  }
  return tokenDb
}

export function getDb(config: Config) {
  if (!db) {
    db = createDatabase({
      ...config.database.pool,
      log: config.database.logsEnabled ? makeDbLogger('Database') : undefined,
    })
  }
  return db
}

export function makeDbLogger(tag: string) {
  const logger = getLogger().for(tag)

  return (event: KyselyLogEvent) => {
    if (event.level === 'error') {
      logger.error('Query failed', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: compiledToSqlQuery(event.query),
        ...(process.env.NODE_ENV === 'production'
          ? {
              sqlTemplate: event.query.sql,
              parameters: event.query.parameters,
            }
          : {}),
      })
    } else {
      logger.info('Query executed', {
        durationMs: event.queryDurationMillis,
        sql: compiledToSqlQuery(event.query),
        ...(process.env.NODE_ENV === 'production'
          ? {
              sqlTemplate: event.query.sql,
              parameters: event.query.parameters,
            }
          : {}),
      })
    }
  }
}
