export interface Config {
  readonly database: DatabaseConfig
  readonly auth: AuthConfig | false
  readonly openapi: OpenApiConfig
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
  apiKeys: {
    optimism: string
    arbitrum: string
    agglayer: string
    theElasticNetwork: string
  }
}

export interface OpenApiConfig {
  url: string
}
