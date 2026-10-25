import type { createRemoteJWKSet } from 'jose'

export interface Config {
  readonly tokenDatabase: DatabaseConfig
  readonly database: DatabaseConfig
  readonly auth: AuthConfig | false
  readonly coingeckoApiKey: string | undefined
  readonly coingeckoApiUrl: string | undefined
  readonly coingeckoCallsPerMinute: number
  readonly etherscanApiKey: string | undefined
  readonly readOnlyAuthToken?: string
  readonly jsonBodyLimitMb: number
  readonly tokenIngestion: TokenIngestionConfig
  readonly tvsCoverage: TvsCoverageConfig
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

export interface TvsCoverageConfig {
  enabled: boolean
  intervalMs: number
  windowDays: number
}

export interface TokenIngestionConfig {
  enabled: boolean
  intervalMs: number
  autoApprove: boolean
  maxProcessedPerRun: number
}
