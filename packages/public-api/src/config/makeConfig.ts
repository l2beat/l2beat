import type { Env } from '@l2beat/backend-tools'
import type { Config } from './Config'

/**
 * Postgres cancels a query that runs longer. Queries take up to a second,
 * and after 30 seconds InMemoryCache starts a running query again, so
 * without a shorter timeout a slow database gets another copy of each
 * query every 30 seconds.
 */
const STATEMENT_TIMEOUT_MS = 15_000

interface MakeConfigOptions {
  name: string
  isLocal?: boolean
}

export function makeConfig(env: Env, options: MakeConfigOptions): Config {
  return {
    database: options.isLocal
      ? {
          connectionString: env.string('LOCAL_DB_URL'),
          application_name: options.name,
          ssl: !env.string('LOCAL_DB_URL').includes('localhost')
            ? { rejectUnauthorized: false }
            : undefined,

          min: 2,
          max: 10,
          statement_timeout: STATEMENT_TIMEOUT_MS,
        }
      : {
          connectionString: env.string('DATABASE_URL'),
          application_name: env.string('DATABASE_APP_NAME', options.name),
          ssl: { rejectUnauthorized: false },

          min: 20,
          max: env.integer('DATABASE_MAX_POOL_SIZE', 20),
          statement_timeout: STATEMENT_TIMEOUT_MS,
        },
    api: {
      port: env.integer('PORT', 3000),
    },
    openapi: {
      url: env.string('BACKEND_URL', 'http://localhost:3000'),
    },
    analytics: options.isLocal
      ? false
      : {
          clientId: env.optionalString('OPENPANEL_CLIENT_ID'),
        },
    cacheEnabled:
      (env.optionalString('DEPLOYMENT_ENV') === 'production' ||
        env.optionalString('DEPLOYMENT_ENV') === 'staging') &&
      !env.boolean('DISABLE_CACHE', false)
        ? true
        : false,
  }
}
