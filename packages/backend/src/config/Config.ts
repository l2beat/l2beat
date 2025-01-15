import { DiscoveryChainConfig } from '@l2beat/discovery'
import {
  AmountConfigEntry,
  ChainId,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { BackendProject } from '@l2beat/config'
import { ChainConverter } from '@l2beat/shared-pure'
import { ActivityTransactionConfig } from '../modules/activity/ActivityTransactionConfig'
import { MulticallConfigEntry } from '../peripherals/multicall/types'
import { ResolvedFeatureFlag } from './FeatureFlags'
import { ChainApi } from './chain/ChainApi'
import { FinalityProjectConfig } from './features/finality'

export interface Config {
  readonly name: string
  readonly isReadonly: boolean
  readonly projects: BackendProject[]
  readonly clock: ClockConfig
  readonly metricsAuth: MetricsAuthConfig | false
  readonly database: DatabaseConfig
  readonly coingeckoApiKey: string
  readonly api: ApiConfig
  readonly health: HealthConfig
  readonly tvl: TvlConfig | false
  readonly trackedTxsConfig: TrackedTxsConfig | false
  readonly finality: FinalityConfig | false
  readonly activity: ActivityConfig | false
  readonly updateMonitor: UpdateMonitorConfig | false
  readonly implementationChangeReporterEnabled: boolean
  readonly flatSourceModuleEnabled: boolean
  readonly lzOAppsEnabled: boolean
  readonly statusEnabled: boolean
  readonly chains: { name: string; chainId: ChainId }[]
  readonly verifiers: boolean
  readonly daBeat: DABeatConfig | false
  readonly da: DaConfig | false
  readonly chainConfig: ChainApi[]
  readonly beaconApi: {
    readonly url: string | undefined
    readonly callsPerMinute: number
    readonly timeout: number
  }

  readonly flags: ResolvedFeatureFlag[]
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
    application_name: string
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
  readonly hourlyCutoffDays: number
  readonly sixHourlyCutoffDays: number
}

export interface TvlConfig {
  readonly prices: PriceConfigEntry[]
  readonly amounts: AmountConfigEntry[]
  readonly chains: ChainTvlConfig[]
  readonly projects: BackendProject[]
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
        }
      | false
  }
}

export interface FinalityConfig {
  readonly configurations: FinalityProjectConfig[]
}

export interface BlockscoutChainConfig {
  readonly type: 'blockscout'
  readonly url: string
}

export interface EtherscanChainConfig {
  readonly type: 'etherscan'
  readonly apiKey: string
  readonly url: string
}

export interface ChainTvlConfig {
  readonly chain: string
  readonly config?: {
    readonly projectId: ProjectId
    readonly chainId: ChainId
    readonly providerUrl: string
    readonly providerCallsPerMinute: number
    readonly minBlockTimestamp: UnixTime
    readonly blockExplorerConfig:
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
  readonly projects: {
    id: ProjectId
    config: ActivityTransactionConfig
    blockExplorerConfig:
      | EtherscanChainConfig
      | BlockscoutChainConfig
      | undefined
  }[]
}

export interface MetricsAuthConfig {
  readonly user: string
  readonly pass: string
}

export interface UpdateMonitorConfig {
  readonly runOnStart?: boolean
  readonly cacheEnabled?: boolean
  readonly cacheUri: string
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
  readonly quicknodeApiUrl: string
  readonly quicknodeCallsPerMinute: number
  readonly celestiaApiUrl: string
  readonly celestiaCallsPerMinute: number
  readonly nearRpcUrl: string
  readonly availWsUrl: string
}

export interface DaConfig {
  readonly ethereum: {
    readonly minBlock: number
  }
  readonly blobscan: {
    readonly url: string
  }
}
