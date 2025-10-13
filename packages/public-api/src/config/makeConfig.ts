import type { Env } from '@l2beat/backend-tools'
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
        }
      : {
          connectionString: env.string(
            'PUBLIC_API_URL',
            env.string('DATABASE_URL'),
          ),
          application_name: env.string('DATABASE_APP_NAME', options.name),
          ssl: { rejectUnauthorized: false },

          min: 20,
          max: env.integer('DATABASE_MAX_POOL_SIZE', 20),
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
  }
}
