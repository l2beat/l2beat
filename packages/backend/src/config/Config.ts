import { LogLevel } from '../tools/Logger'

export interface Config {
  readonly name: string
  readonly logger: LoggerConfig
  readonly metricsAuth: MetricsAuthConfig | false
  readonly api: ApiConfig | false
  readonly health: HealthConfig
  readonly discovery: DiscoveryConfig | false
  readonly discoveryApi: DiscoveryApiConfig | false
}

export interface LoggerConfig {
  readonly logLevel: LogLevel
  readonly format: 'pretty' | 'json'
}

export interface ApiConfig {
  readonly port: number
}

export interface HealthConfig {
  readonly releasedAt?: string
  readonly startedAt: string
  readonly commitSha: string
}

export interface DiscoveryConfig {
  readonly project: string
  readonly blockNumber?: number
  readonly alchemyApiKey: string
  readonly etherscanApiKey: string
}

export interface DiscoveryApiConfig {
  readonly alchemyApiKey: string
  readonly etherscanApiKey: string
}

export interface MetricsAuthConfig {
  readonly user: string
  readonly pass: string
}
