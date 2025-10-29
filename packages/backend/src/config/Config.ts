import type {
  BlockDaTrackingConfig,
  ChainConfig,
  OnchainVerifier,
  ProjectActivityConfig,
  TimestampDaTrackingConfig,
} from '@l2beat/config'
import type {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryPaths,
} from '@l2beat/discovery'
import type { TrackedTxConfigEntry } from '@l2beat/shared'
import type { CoingeckoId, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  AmountConfig,
  BlockTimestampConfig,
  PriceConfig,
  ProjectTvsConfig,
} from '../modules/tvs/types'
import type { MulticallConfigEntry } from '../peripherals/multicall/types'
import type { ChainApi } from './chain/ChainApi'
import type { ResolvedFeatureFlag } from './FeatureFlags'

export interface Config {
  readonly name: string
  readonly isReadonly: boolean
  readonly clock: ClockConfig
  readonly metricsAuth: MetricsAuthConfig | false
  readonly database: DatabaseConfig
  readonly coingeckoApiKey: string
  readonly api: ApiConfig
  readonly health: HealthConfig
  readonly tvs: TvsConfig | false
  readonly trackedTxsConfig: TrackedTxsConfig | false
  readonly activity: ActivityConfig | false
  readonly updateMonitor: UpdateMonitorConfig | false
  readonly implementationChangeReporterEnabled: boolean
  readonly flatSourceModuleEnabled: boolean
  readonly lzOAppsEnabled: boolean
  readonly statusEnabled: boolean
  readonly chains: { name: string; chainId: number | undefined }[]
  readonly verifiers: VerifiersConfig | false
  readonly daBeat: DaBeatConfig | false
  readonly ecosystems: EcosystemsConfig | false
  readonly chainConfig: ChainApi[]
  readonly beaconApi: {
    readonly url: string | undefined
    readonly callsPerMinute: number
    readonly timeout: number
  }
  readonly da: DataAvailabilityTrackingConfig | false
  readonly blockSync: BlockSyncModuleConfig
  readonly anomalies: AnomaliesConfig | false
  readonly interop: InteropFeatureConfig | false

  readonly flags: ResolvedFeatureFlag[]
}

export interface ApiConfig {
  readonly port: number
  readonly cache: {
    readonly tvs: boolean
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

export interface TvsConfig {
  readonly projects: (ProjectTvsConfig & { amountSources: string[] })[]
  readonly amounts: AmountConfig[]
  readonly prices: PriceConfig[]
  readonly chains: string[]
  readonly blockTimestamps: BlockTimestampConfig[]
}

export interface TrackedTxProject {
  readonly id: ProjectId
  readonly isArchived: boolean
  readonly configurations: TrackedTxConfigEntry[]
}

export interface TrackedTxsConfig {
  readonly projects: TrackedTxProject[]
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

export interface BlockscoutChainConfig {
  readonly type: 'blockscout'
  readonly url: string
}

export interface EtherscanChainConfig {
  readonly type: 'etherscan'
  readonly apiKey: string
  readonly url: string
}

export interface RoutescanChainConfig {
  readonly type: 'routescan'
  readonly url: string
}

export interface ChainTvlConfig {
  readonly name: string
  readonly providerUrl: string
  readonly providerCallsPerMinute: number
  readonly minBlockTimestamp: UnixTime
  readonly blockExplorerConfig:
    | EtherscanChainConfig
    | BlockscoutChainConfig
    | RoutescanChainConfig
    | undefined
  readonly multicallConfig: MulticallConfigEntry[]
}

export interface HealthConfig {
  readonly releasedAt?: string
  readonly startedAt: string
  readonly commitSha: string
}

export interface ActivityConfig {
  readonly voyagerApiKey: string | undefined
  readonly projects: ActivityConfigProject[]
}

export interface ActivityConfigProject {
  id: ProjectId
  chainName: string
  activityConfig: ProjectActivityConfig
}

export interface MetricsAuthConfig {
  readonly user: string
  readonly pass: string
}

export interface UpdateMonitorConfig {
  readonly configReader: ConfigReader
  readonly paths: DiscoveryPaths
  readonly runOnStart?: boolean
  readonly updateDifferEnabled?: boolean
  readonly cacheEnabled?: boolean
  readonly cacheUri: string
  readonly chains: DiscoveryChainConfig[]
  readonly disabledChains: string[]
  readonly disabledProjects: string[]
  readonly discord: DiscordConfig | false
  readonly updateMessagesRetentionPeriodDays: number
  readonly workerPool: {
    readonly workerCount: number
    readonly timeoutPerTaskMs: number
    readonly timeoutPerRunMs: number
  }
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

export interface AnomaliesConfig {
  readonly anomaliesWebhookUrl?: string
  readonly anomaliesMinDuration: number
}

export interface InteropFeatureConfig {
  capture: {
    enabled: boolean
    chains: {
      name: string
      type: 'evm'
    }[]
  }
  matching: boolean
  cleaner: boolean
  dashboard: {
    enabled: boolean
    getExplorerUrl: (chain: string) => string | undefined
  }
  compare: {
    enabled: boolean
  }
  financials: {
    enabled: boolean
  }
  config: {
    enabled: boolean
    chains: { id: number; name: string }[]
  }
}

export interface DaBeatConfig {
  readonly projectsForDaBeatStats: ProjectId[]
  /** Coingecko ids of tokens for economic security */
  readonly coingeckoIds: string[]
  readonly celestiaApiUrl: string
  readonly celestiaCallsPerMinute: number
  readonly nearRpcUrl: string
  readonly availWsUrl: string
}

export interface EcosystemTokenConfig {
  readonly configurationId: string
  readonly projectId: ProjectId
  readonly coingeckoId: CoingeckoId
}
export interface EcosystemsConfig {
  readonly tokens: EcosystemTokenConfig[]
}

type BlockLayerAsProjectDaTrackingConfig = {
  type: 'baseLayer'
  daLayer: string
  sinceBlock: number
  untilBlock?: number
}

type TimestampLayerAsProjectDaTrackingConfig = {
  type: 'baseLayer'
  daLayer: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export type BlockDaIndexedConfig = (
  | BlockDaTrackingConfig
  | BlockLayerAsProjectDaTrackingConfig
) & {
  /** Hash computed automatically based on fields */
  configurationId: string
  projectId: ProjectId
}

export type TimestampDaIndexedConfig = (
  | TimestampDaTrackingConfig
  | TimestampLayerAsProjectDaTrackingConfig
) & {
  /** Hash computed automatically based on fields */
  configurationId: string
  projectId: ProjectId
}

export type BlockLayerDaTrackingConfig = {
  type: 'ethereum' | 'celestia' | 'avail'
  name: string
  url: string
  callsPerMinute: number
  batchSize: number
  startingBlock: number
}

export type TimestampLayerDaTrackingConfig = {
  type: 'eigen-da'
  name: string
  url: string
  callsPerMinute: number
  startingTimestamp: UnixTime
  perProjectUrl?: string
}

export interface DataAvailabilityTrackingConfig {
  readonly blockLayers: BlockLayerDaTrackingConfig[]
  readonly timestampLayers: TimestampLayerDaTrackingConfig[]
  readonly blockProjects: BlockDaIndexedConfig[]
  readonly timestampProjects: TimestampDaIndexedConfig[]
}

export interface BlockSyncModuleConfig {
  delayFromTipInSeconds: number
  ethereumWsUrl?: string
}
