import type { Env } from '@l2beat/backend-tools'
import { compiledToSqlQuery, type LogEvent } from '@l2beat/database'
import { createLogger } from '../utils/logger/createLogger'
import type { Config } from './Config'

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
          log: env.boolean('DATABASE_LOG_ENABLED')
            ? makeDbLogger(env)
            : undefined,
        }
      : {
          connectionString: env.string(
            'PUBLIC_API_URL',
            env.optionalString('DATABASE_URL'),
          ),
          application_name: env.string('DATABASE_APP_NAME', options.name),
          ssl: { rejectUnauthorized: false },

          min: 20,
          max: env.integer('DATABASE_MAX_POOL_SIZE', 20),
          log: env.boolean('DATABASE_LOG_ENABLED')
            ? makeDbLogger(env)
            : undefined,
        },
    api: {
      port: env.integer('PORT', 3000),
    },
    auth: options.isLocal
      ? false
      : {
          apiKeys: {
            l2beat: env.string('API_KEY_L2BEAT'),
            optimism: env.string('API_KEY_OPTIMISM'),
            arbitrum: env.string('API_KEY_ARBITRUM'),
            agglayer: env.string('API_KEY_AGGLAYER'),
            theElasticNetwork: env.string('API_KEY_THE_ELASTIC_NETWORK'),
          },
        },
    openapi: {
      url: env.string('BACKEND_URL', 'http://localhost:3000'),
    },
    cacheEnabled:
      (env.optionalString('DEPLOYMENT_ENV') === 'production' ||
        env.optionalString('DEPLOYMENT_ENV') === 'staging') &&
      !env.boolean('DISABLE_CACHE', false)
        ? true
        : false,
  }
}

function makeDbLogger(env: Env) {
  const logger = createLogger(env, { indexPrefix: 'database-prod' })

  return (event: LogEvent) => {
    if (event.level === 'error') {
      logger.error('Query failed', {
        durationMs: event.queryDurationMillis,
        error: event.error,
        sql: compiledToSqlQuery(event.query),
        ...(env.string('NODE_ENV') === 'production'
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
        ...(env.string('NODE_ENV') === 'production'
          ? {
              sqlTemplate: event.query.sql,
              parameters: event.query.parameters,
            }
          : {}),
      })
    }
  }
}
