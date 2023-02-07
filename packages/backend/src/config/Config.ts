import { LogLevel } from '@l2beat/common'
import { Layer2TransactionApi } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'
import { Knex } from 'knex'

import { Project, Token } from '../model'

export interface Config {
  readonly name: string
  readonly projects: Project[]
  readonly syncEnabled: boolean
  readonly logger: LoggerConfig
  readonly logThrottler: LogThrottlerConfig | false
  readonly clock: ClockConfig
  readonly metricsAuth: MetricsAuthConfig | false
  readonly database: DatabaseConfig | false
  readonly api: ApiConfig | false
  readonly health: HealthConfig
  readonly invert: InversionConfig | false
  readonly tvl: TvlConfig | false
  readonly activity: ActivityConfig | false
  readonly discovery: DiscoveryModuleConfig | false
  readonly discoveryWatcher: DiscoveryWatcherConfig | false
}

export interface LoggerConfig {
  readonly logLevel: LogLevel
  readonly format: 'pretty' | 'json'
}

export interface LogThrottlerConfig {
  readonly threshold: number
  readonly thresholdTimeInMs: number
  readonly throttleTimeInMs: number
}

export interface ApiConfig {
  readonly port: number
}

export interface DatabaseConfig {
  readonly connection: Knex.Config['connection']
  readonly freshStart: boolean
  readonly connectionPoolSize: {
    min: number
    max: number
  }
}

export interface ClockConfig {
  readonly minBlockTimestamp: UnixTime
  readonly safeTimeOffsetSeconds: number
}

export interface TvlConfig {
  readonly tokens: Token[]
  readonly alchemyApiKey: string
  readonly etherscanApiKey: string
  readonly coingeckoApiKey: string | undefined
}

export interface HealthConfig {
  readonly releasedAt?: string
  readonly startedAt: string
  readonly commitSha: string
}

export interface InversionConfig {
  readonly file: string
  readonly useMermaidMarkup: boolean
}

export interface ActivityConfig {
  readonly starkexApiKey: string
  readonly starkexCallsPerMinute: number
  readonly skipExplicitExclusion: boolean
  readonly allowedProjectIds?: string[]
  readonly projects: Record<string, Layer2TransactionApi | undefined>
}

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly blockNumber?: number
  readonly alchemyApiKey: string
  readonly etherscanApiKey: string
}

export interface MetricsAuthConfig {
  readonly user: string
  readonly pass: string
}

export interface DiscoveryWatcherConfig {
  readonly alchemyApiKey: string
  readonly etherscanApiKey: string
  readonly discord:
    | {
        readonly token: string
        readonly channelId: string
      }
    | false
}
