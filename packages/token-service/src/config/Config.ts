import type { createRemoteJWKSet } from 'jose'

export interface Config {
  readonly database: DatabaseConfig
  readonly auth: AuthConfig | false
  readonly coingeckoApiKey: string
}

export interface DatabaseConfig {
  connectionString: string
  application_name: string
  ssl?: {
    rejectUnauthorized?: boolean
  }
  min: number
  max: number
}

export interface AuthConfig {
  JWKS: ReturnType<typeof createRemoteJWKSet>
  aud: string
  teamDomain: string
}
