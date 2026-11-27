export interface Config {
  readonly database: DatabaseConfig
  readonly api: ApiConfig
  readonly openapi: OpenApiConfig
  readonly analytics: AnalyticsConfig | false
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
  /** Milliseconds. Named as pg reads it. */
  statement_timeout: number
}

export interface OpenApiConfig {
  url: string
}

export interface AnalyticsConfig {
  clientId?: string
}
