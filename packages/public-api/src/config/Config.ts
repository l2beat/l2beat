import type { LogEvent } from '@l2beat/database'

export interface Config {
  readonly database: DatabaseConfig
  readonly api: ApiConfig
  readonly auth: AuthConfig | false
  readonly openapi: OpenApiConfig
  readonly cacheEnabled: boolean
}

export interface ApiConfig {
  port: number
}

export interface DatabaseConfig {
  connectionString: string
  application_name: string
  ssl?: {
    rejectUnauthorized?: boolean
  }
  min: number
  max: number
  log: ((event: LogEvent) => void) | undefined
}

export interface AuthConfig {
  apiKeys: Record<string, string>
}

export interface OpenApiConfig {
  url: string
}
