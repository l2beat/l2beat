import type { createRemoteJWKSet } from 'jose'

export interface Config {
  readonly tokenDatabase: DatabaseConfig
  readonly database: DatabaseConfig
  readonly auth: AuthConfig | false
  readonly coingeckoApiKey: string | undefined
  readonly etherscanApiKey: string | undefined
  readonly readOnlyAuthToken?: string
  readonly jsonBodyLimitMb: number
}

export interface DatabaseConfig {
  pool: {
    connectionString: string
    application_name: string
    ssl?: {
      rejectUnauthorized?: boolean
    }
    min: number
    max: number
  }
  logsEnabled: boolean
}

export interface AuthConfig {
  JWKS: ReturnType<typeof createRemoteJWKSet>
  aud: string
  teamDomain: string
}
