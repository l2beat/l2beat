import type { Database } from '@l2beat/database'
import { compiledToSqlQuery, createDatabase } from '@l2beat/database'
import type { LogEvent } from 'kysely'
import { env } from '~/env'
import { createLogger } from './utils/logger'

let db: Database | undefined

export function getDb() {
  if (!db) {
    db = !env.MOCK
      ? createDatabase({
          application_name: createConnectionTag(),
          connectionString: env.DATABASE_URL,
          ssl: ssl(),
          ...pool(),
          log: env.DATABASE_LOG_ENABLED ? makeLogger() : undefined,
        })
      : createThrowingProxy()
  }

  return db
}

function createThrowingProxy() {
  return new Proxy({} as Database, {
    get: () => {
      throw new Error(
        'DB has been called on mock! Report it to engineering team :)',
      )
    },
  })
}

// Tag is limited to 63 characters, so it will cut off the excess
function createConnectionTag() {
  const suffix = env.NODE_ENV === 'production' ? 'prod' : 'dev'
  const base = `FE-${suffix}`

  if (env.VERCEL_ENV === 'preview') {
    return `${base}-${env.VERCEL_GIT_COMMIT_REF}-${env.VERCEL_GIT_COMMIT_SHA}`
  }

  return base
}

function ssl() {
  return env.NODE_ENV === 'production' ||
    env.DATABASE_URL.includes('amazonaws.com')
    ? { rejectUnauthorized: false }
    : undefined
}

function pool() {
  if (env.NODE_ENV === 'production') {
    return {
      min: 50,
      max: 200,
    }
  }

  return {
    min: 2,
    max: 5,
  }
}

function makeLogger() {
  const appLogger = createLogger().for('Database')

  return (event: LogEvent) => {
    if (event.level === 'error') {
      appLogger.error('Query failed', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: compiledToSqlQuery(event.query),
        ...(env.NODE_ENV === 'production'
          ? [
              {
                sqlTemplate: event.query.sql,
                parameters: event.query.parameters,
              },
            ]
          : []),
      })
    } else {
      appLogger.info('Query executed', {
        durationMs: event.queryDurationMillis,
        sql: compiledToSqlQuery(event.query),
        ...(env.NODE_ENV === 'production'
          ? [
              {
                sqlTemplate: event.query.sql,
                parameters: event.query.parameters,
              },
            ]
          : []),
      })
    }
  }
}
