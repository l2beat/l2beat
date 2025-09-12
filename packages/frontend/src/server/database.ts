import type { Database } from '@l2beat/database'
import { compiledToSqlQuery, createDatabase } from '@l2beat/database'
import type { LogEvent } from 'kysely'
import { env } from '~/env'
import { getLogger } from './utils/logger'

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
  const suffix =
    env.DEPLOYMENT_ENV === 'production'
      ? 'prod'
      : env.DEPLOYMENT_ENV === 'staging'
        ? 'staging'
        : env.DEPLOYMENT_ENV === 'preview'
          ? 'preview'
          : 'dev'
  const base = `FE-${suffix}`

  if (env.HEROKU_APP_NAME) {
    return `${base}-${env.HEROKU_APP_NAME}`
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
  switch (env.DEPLOYMENT_ENV) {
    case 'production':
      return {
        min: 50,
        max: 200,
      }
    case 'staging':
    case 'preview':
      return {
        min: 2,
        max: 5,
      }
    default:
      return {
        min: 2,
      }
  }
}

function makeLogger() {
  const logger = getLogger().for('Database')

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
