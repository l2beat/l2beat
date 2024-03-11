import { LoggerOptions } from '@l2beat/backend-tools'
import { DiscoveryChainConfig } from '@l2beat/discovery'
import { ChainId, ProjectId, Token, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

import { Project } from '../model/Project'
import { ActivityTransactionConfig } from '../modules/activity/ActivityTransactionConfig'
import { MulticallConfigEntry } from '../peripherals/multicall/types'
import { ResolvedFeatureFlag } from './FeatureFlags'
import { FinalityProjectConfig } from './features/finality'

export interface Config {
  readonly name: string
  readonly projects: Project[]
  readonly tokens: Token[]
  readonly logger: LoggerConfig
  readonly logThrottler: LogThrottlerConfig | false
  readonly clock: ClockConfig
  readonly metricsAuth: MetricsAuthConfig | false
  readonly database: DatabaseConfig
  readonly api: ApiConfig
  readonly health: HealthConfig
  readonly tvl: TvlConfig
  readonly trackedTxsConfig: TrackedTxsConfig | false
  readonly finality: FinalityConfig | false
  readonly activity: ActivityConfig | false
  readonly updateMonitor: UpdateMonitorConfig | false
  readonly diffHistory: DiffHistoryConfig | false
  readonly statusEnabled: boolean
  readonly chains: { name: string; chainId: ChainId }[]
  readonly flags: ResolvedFeatureFlag[]
  readonly tvlCleanerEnabled: boolean
}

export type LoggerConfig = Pick<LoggerOptions, 'logLevel' | 'format'> &
  Partial<LoggerOptions>

export interface LogThrottlerConfig {
  readonly callsUntilThrottle: number
  readonly clearIntervalMs: number
  readonly throttleTimeMs: number
}

export interface ApiConfig {
  readonly port: number
  readonly cache: {
    readonly tvl: boolean
    readonly liveness: boolean
  }
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
  readonly enabled: boolean
  readonly errorOnUnsyncedTvl: boolean
  readonly coingeckoApiKey: string | undefined
  readonly ethereum: ChainTvlConfig
  readonly modules: ChainTvlConfig[]
}

export interface TrackedTxsConfig {
  readonly bigQuery: {
    readonly clientEmail: string
    readonly privateKey: string
    readonly projectId: string
    readonly queryLimitGb: number
    readonly queryWarningLimitGb: number
  }
  readonly minTimestamp: UnixTime
  readonly uses: {
    readonly liveness: boolean
  }
}

export interface FinalityConfig {
  readonly ethereumProviderUrl: string
  readonly ethereumProviderCallsPerMinute: number
  readonly configurations: FinalityProjectConfig[]
}

export interface BlockscoutChainConfig {
  readonly type: 'blockscout'
  readonly blockscoutApiUrl: string
}

export interface EtherscanChainConfig {
  readonly type: 'etherscan'
  readonly etherscanApiKey: string
  readonly etherscanApiUrl: string
}

export interface ChainTvlConfig {
  readonly chain: string
  readonly config?: {
    readonly projectId: ProjectId
    readonly chainId: ChainId
    readonly providerUrl: string
    readonly providerCallsPerMinute: number
    readonly minBlockTimestamp: UnixTime
    readonly blockNumberProviderConfig:
      | EtherscanChainConfig
      | BlockscoutChainConfig
    readonly multicallConfig: MulticallConfigEntry[]
  }
}

export interface HealthConfig {
  readonly releasedAt?: string
  readonly startedAt: string
  readonly commitSha: string
}
export interface ActivityConfig {
  readonly starkexApiKey: string
  readonly starkexCallsPerMinute: number
  readonly projectsExcludedFromAPI: string[]
  readonly allowedProjectIds?: string[]
  readonly projects: { id: ProjectId; config: ActivityTransactionConfig }[]
}

export interface MetricsAuthConfig {
  readonly user: string
  readonly pass: string
}

export interface UpdateMonitorConfig {
  readonly runOnStart?: boolean
  readonly chains: UpdateMonitorChainConfig[]
  readonly discord: DiscordConfig | false
}

export interface DiffHistoryConfig {
  readonly chains: DiffHistoryChainConfig[]
}

export interface DiscordConfig {
  readonly token: string
  readonly publicChannelId?: string
  readonly internalChannelId: string
  readonly callsPerMinute: number
}

export interface DiscoveryCacheChainConfig {
  reorgSafeDepth?: number
}

export type UpdateMonitorChainConfig = DiscoveryChainConfig &
  DiscoveryCacheChainConfig

export type DiffHistoryChainConfig = UpdateMonitorChainConfig
