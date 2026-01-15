import {
  compiledToSqlQuery,
  createTokenDatabase,
  type TokenDatabase,
} from '@l2beat/database'
import type { LogEvent } from 'kysely'
import { env } from '~/env'
import { createConnectionTag, pool } from './database'
import { getLogger } from './utils/logger'

let db: TokenDatabase | undefined

export function getTokenDb() {
  if (!db) {
    db = !env.MOCK
      ? createTokenDatabase({
          application_name: createConnectionTag(),
          connectionString: env.TOKENS_DATABASE_URL,
          ssl:
            env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
          ...pool(),
          log: env.TOKENS_DATABASE_LOG_ENABLED ? makeLogger() : undefined,
        })
      : createThrowingProxy()
  }
  return db
}

function createThrowingProxy() {
  return new Proxy({} as TokenDatabase, {
    get: () => {
      throw new Error(
        'TokenDB has been called on mock! Report it to engineering team :)',
      )
    },
  })
}

function makeLogger() {
  const logger = getLogger().for('TokenDatabase')

  return (event: LogEvent) => {
    if (event.level === 'error') {
      logger.error('Query failed', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: compiledToSqlQuery(event.query),
        ...(env.NODE_ENV === 'production'
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
        ...(env.NODE_ENV === 'production'
          ? {
              sqlTemplate: event.query.sql,
              parameters: event.query.parameters,
            }
          : {}),
      })
    }
  }
}
