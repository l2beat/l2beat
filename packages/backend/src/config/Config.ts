import { LoggerOptions } from '@l2beat/backend-tools'
import { DiscoveryChainConfig } from '@l2beat/discovery'
import {
  AmountConfigEntry,
  ChainId,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../model/Project'
import { ActivityTransactionConfig } from '../modules/activity/ActivityTransactionConfig'
import { MulticallConfigEntry } from '../peripherals/multicall/types'
import { ChainConverter } from '../tools/ChainConverter'
import { ResolvedFeatureFlag } from './FeatureFlags'
import { FinalityProjectConfig } from './features/finality'

export interface Config {
  readonly name: string
  readonly isReadonly: boolean
  readonly projects: Project[]
  readonly clock: ClockConfig
  readonly metricsAuth: MetricsAuthConfig | false
  readonly database: DatabaseConfig
  readonly api: ApiConfig
  readonly health: HealthConfig
  readonly tvl: TvlConfig | false
  readonly trackedTxsConfig: TrackedTxsConfig | false
  readonly finality: FinalityConfig | false
  readonly activity: ActivityConfig | false
  readonly updateMonitor: UpdateMonitorConfig | false
  readonly implementationChangeReporterEnabled: boolean
  readonly lzOAppsEnabled: boolean
  readonly statusEnabled: boolean
  readonly chains: { name: string; chainId: ChainId }[]
  readonly flags: ResolvedFeatureFlag[]
  readonly verifiers: boolean
  readonly daBeat: DABeatConfig | false
}

export type LoggerConfig = Pick<LoggerOptions, 'logLevel'> &
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
    readonly verifiers: boolean
  }
}

export interface DatabaseConfig {
  readonly connection: {
    connectionString: string
    ssl?: {
      rejectUnauthorized?: boolean
    }
  }
  readonly freshStart: boolean
  readonly enableQueryLogging: boolean
  readonly requiredMajorVersion?: number
  readonly connectionPoolSize: {
    min: number
    max: number
  }
  readonly isReadonly: boolean
}

export interface ClockConfig {
  readonly minBlockTimestamp: UnixTime
  readonly safeTimeOffsetSeconds: number
}

export interface TvlConfig {
  readonly prices: PriceConfigEntry[]
  readonly amounts: AmountConfigEntry[]
  readonly chains: ChainTvlConfig[]
  readonly projects: Project[]
  readonly coingeckoApiKey: string | undefined
  readonly chainConverter: ChainConverter
  // used by value indexer
  readonly maxTimestampsToAggregateAtOnce: number
  readonly projectsExcludedFromApi: string[]
  readonly tvlCleanerEnabled: boolean
}

export interface TrackedTxsConfig {
  readonly bigQuery: {
    readonly clientEmail: string
    readonly privateKey: string
    readonly projectId: string
  }
  readonly minTimestamp: UnixTime
  readonly uses: {
    readonly liveness: boolean
    readonly l2costs:
      | {
          readonly aggregatorEnabled: boolean
          readonly coingeckoApiKey: string | undefined
        }
      | false
  }
}

export interface FinalityConfig {
  readonly ethereumProviderUrl: string
  readonly ethereumProviderCallsPerMinute: number
  readonly beaconApiUrl: string
  readonly beaconApiCPM: number
  readonly beaconApiTimeout: number
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
      | undefined
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
  readonly enableCache?: boolean
  readonly chains: DiscoveryChainConfig[]
  readonly discord: DiscordConfig | false
}

export interface DiscordConfig {
  readonly token: string
  readonly publicChannelId?: string
  readonly internalChannelId: string
  readonly callsPerMinute: number
}

export interface DABeatConfig {
  readonly coingeckoApiKey: string
  readonly quicknodeApiUrl: string
  readonly quicknodeCallsPerMinute: number
  readonly celestiaApiUrl: string
  readonly celestiaCallsPerMinute: number
}
