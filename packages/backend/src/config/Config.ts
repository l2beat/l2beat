import type { BackendProject } from '@l2beat/backend-shared'
import type {
  ChainConfig,
  OnchainVerifier,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { DiscoveryChainConfig } from '@l2beat/discovery'
import type {
  AmountConfigEntry,
  ChainId,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import type { ChainConverter } from '@l2beat/shared-pure'
import type { ActivityTransactionConfig } from '../modules/activity/ActivityTransactionConfig'
import type { MulticallConfigEntry } from '../peripherals/multicall/types'
import type { ResolvedFeatureFlag } from './FeatureFlags'
import type { ChainApi } from './chain/ChainApi'
import type { FinalityProjectConfig } from './features/finality'

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
  readonly verifiers: VerifiersConfig | false
  readonly daBeat: DaBeatConfig | false
  readonly chainConfig: ChainApi[]
  readonly beaconApi: {
    readonly url: string | undefined
    readonly callsPerMinute: number
    readonly timeout: number
  }
  readonly da: DataAvailabilityTrackingConfig | false

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
  readonly updateMessagesRetentionPeriodDays: number
}

export interface VerifiersConfig {
  readonly verifiers: OnchainVerifier[]
  readonly chains: ChainConfig[]
}

export interface DiscordConfig {
  readonly token: string
  readonly publicChannelId?: string
  readonly internalChannelId: string
  readonly callsPerMinute: number
}

export interface DaBeatConfig {
  /** Coingecko ids of tokens for economic security */
  readonly coingeckoIds: string[]
  /** Names of the economic security types */
  readonly types: string[]
  readonly quicknodeApiUrl: string
  readonly quicknodeCallsPerMinute: number
  readonly celestiaApiUrl: string
  readonly celestiaCallsPerMinute: number
  readonly nearRpcUrl: string
  readonly availWsUrl: string
}

type BaseLayerConfig = {
  type: 'baseLayer'
  daLayer: string
  projectId: ProjectId
  sinceBlock: number
  untilBlock?: number
}

export type DaTrackingConfig =
  | (ProjectDaTrackingConfig & { projectId: ProjectId })
  | BaseLayerConfig

export interface DataAvailabilityTrackingConfig {
  readonly layers: {
    type: 'ethereum' | 'celestia' | 'avail'
    name: string
    url: string
    callsPerMinute: number
    batchSize: number
    startingBlock: number
  }[]

  readonly projects: {
    /** Hash computed automatically based on fields */
    configurationId: string
    config: DaTrackingConfig
  }[]
}
