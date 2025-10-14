import type { Env } from '@l2beat/backend-tools'
import { createRemoteJWKSet } from 'jose'
import type { AuthConfig, Config, DatabaseConfig } from './Config'

interface MakeConfigOptions {
  name: string
  isLocal?: boolean
}

export function makeConfig(env: Env, options: MakeConfigOptions): Config {
  return {
    database: getDatabaseConfig(env, options),
    auth: options.isLocal ? false : getAuthConfig(env),
    coingeckoApiKey: env.string('COINGECKO_API_KEY'),
  }
}

function getDatabaseConfig(
  env: Env,
  options: MakeConfigOptions,
): DatabaseConfig {
  const localDbUrl = env.string(
    'LOCAL_DB_URL',
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
        connectionString: env.string('DATABASE_URL'),
        application_name: env.string('DATABASE_APP_NAME', options.name),
        ssl: { rejectUnauthorized: false },

        min: 20,
        max: env.integer('DATABASE_MAX_POOL_SIZE', 20),
      }
}

function getAuthConfig(env: Env): AuthConfig {
  const TEAM_DOMAIN = env.string('CF_TEAM_DOMAIN') // e.g. https://myteam.cloudflareaccess.com
  const AUD = env.string('CF_ACCESS_AUD') // your Access app's AUD
  return {
    JWKS: createRemoteJWKSet(new URL(`${TEAM_DOMAIN}/cdn-cgi/access/certs`)),
    aud: AUD,
    teamDomain: TEAM_DOMAIN,
  }
}
