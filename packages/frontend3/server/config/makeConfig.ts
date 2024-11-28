import { Env } from '@l2beat/backend-tools'
import { Config } from './Config'

interface MakeConfigOptions {
  name: string
  isLocal?: boolean
}

export function makeConfig(
  env: Env,
  { name, isLocal }: MakeConfigOptions,
): Config {
  return {
    name,
    isLocal: !!isLocal,
    port: env.integer('PORT', 8347),
    database:
      !isLocal || env.optionalString('DATABASE_URL')
        ? {
            connection: {
              connectionString: env.string('DATABASE_URL'),
              ssl: !env.string('DATABASE_URL').includes('localhost')
                ? { rejectUnauthorized: false }
                : undefined,
            },
            connectionPoolSize: isLocal
              ? { min: 2, max: 10 } // knex defaults
              : { min: 20, max: 200 },
          }
        : undefined,
  }
}
