import { getEnv } from '@l2beat/backend-tools'

export interface DefiscanEndpointsConfig {
  port: number
  logLevel: string
  debank: {
    apiKey: string
    baseUrl: string
    callsPerMinute: number
    enabled: boolean
  }
  cache: {
    balancesTTL: number // seconds
    positionsTTL: number // seconds
  }
}

export function getConfig(): DefiscanEndpointsConfig {
  const env = getEnv()

  return {
    port: env.integer('PORT', 3001),
    logLevel: env.string('LOG_LEVEL', 'INFO'),
    debank: {
      apiKey: env.string('DEBANK_API_KEY'),
      baseUrl: env.string(
        'DEBANK_BASE_URL',
        'https://pro-openapi.debank.com',
      ),
      callsPerMinute: env.integer('DEBANK_RATE_LIMIT', 60),
      enabled: env.boolean('DEBANK_ENABLED', true),
    },
    cache: {
      balancesTTL: env.integer('CACHE_BALANCES_TTL', 3600), // 60 minutes default
      positionsTTL: env.integer('CACHE_POSITIONS_TTL', 3600), // 60 minutes default
    },
  }
}
