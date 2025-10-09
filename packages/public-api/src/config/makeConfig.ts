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
          connectionString: env.string('DATABASE_URL'),
          application_name: env.string('DATABASE_APP_NAME', options.name),
          ssl: { rejectUnauthorized: false },

          min: 20,
          max: env.integer('DATABASE_MAX_POOL_SIZE', 20),
        },
  }
}
