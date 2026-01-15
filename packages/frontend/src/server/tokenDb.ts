import { type Env, getEnv } from '@l2beat/backend-tools'
import { createTokenDatabase, type TokenDatabase } from '@l2beat/database'

let db: TokenDatabase | undefined

export function getTokenDb() {
  const config = getConfig()
  if (!db) {
    db = createTokenDatabase(config)
  }
  return db
}

export function getConfig() {
  const env = getEnv()
  const deploymentEnv = env.optionalString('DEPLOYMENT_ENV') ?? 'local'

  switch (deploymentEnv) {
    case 'local':
      return getDatabaseConfig(env, {
        name: 'tokens/Local',
        isLocal: true,
      })
    case 'staging':
      return getDatabaseConfig(env, { name: 'tokens/STG' })
    case 'production':
      return getDatabaseConfig(env, { name: 'tokens/PROD' })
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}

function getDatabaseConfig(
  env: Env,
  options: {
    name: string
    isLocal?: boolean
  },
) {
  const localDbUrl = env.string(
    'LOCAL_TOKENS_DB_URL',
    'postgresql://postgres:password@localhost:5432/l2beat_local',
  )
  return options.isLocal
    ? {
        connectionString: localDbUrl,
        application_name: options.name,
        ssl: !localDbUrl.includes('localhost')
          ? { rejectUnauthorized: false }
          : undefined,

        min: 2,
        max: 10,
      }
    : {
        connectionString: env.string('TOKENS_DATABASE_URL'),
        application_name: env.string('TOKENS_DATABASE_APP_NAME', options.name),
        ssl: { rejectUnauthorized: false },

        min: 20,
        max: env.integer('TOKENS_DATABASE_MAX_POOL_SIZE', 20),
      }
}
