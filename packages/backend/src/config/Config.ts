import type {
  ChainConfig,
  OnchainVerifier,
  ProjectActivityConfig,
  ProjectDaTrackingConfig,
  ProjectFinalityConfig,
} from '@l2beat/config'
import type {
  ConfigReader,
  DiscoveryChainConfig,
  DiscoveryPaths,
} from '@l2beat/discovery'
import type { TrackedTxConfigEntry } from '@l2beat/shared'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  AmountConfig,
  BlockTimestampConfig,
  PriceConfig,
  ProjectTvsConfig,
} from '../modules/tvs/types'
import type { MulticallConfigEntry } from '../peripherals/multicall/types'
import type { ResolvedFeatureFlag } from './FeatureFlags'
import type { ChainApi } from './chain/ChainApi'

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
  readonly finality: FinalityConfig | false
  readonly activity: ActivityConfig | false
  readonly updateMonitor: UpdateMonitorConfig | false
  readonly implementationChangeReporterEnabled: boolean
  readonly flatSourceModuleEnabled: boolean
  readonly lzOAppsEnabled: boolean
  readonly statusEnabled: boolean
  readonly chains: { name: string; chainId: number | undefined }[]
  readonly verifiers: VerifiersConfig | false
  readonly daBeat: DaBeatConfig | false
  readonly chainConfig: ChainApi[]
  readonly beaconApi: {
    readonly url: string | undefined
    readonly callsPerMinute: number
    readonly timeout: number
  }
  readonly da: DataAvailabilityTrackingConfig | false
  readonly da2: DataAvailabilityTrackingConfig2 | false

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

export interface FinalityConfig {
  readonly configurations: FinalityConfigProject[]
}

export type FinalityConfigProject = ProjectFinalityConfig & {
  projectId: ProjectId
  url?: string
  callsPerMinute?: number
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

// DataAvailability2
type LayerAsProjectDaTrackingConfig = {
  type: 'baseLayer'
  daLayer: string
  sinceBlock: number
  untilBlock?: number
}

export type DaIndexedConfig = (
  | ProjectDaTrackingConfig
  | LayerAsProjectDaTrackingConfig
) & {
  /** Hash computed automatically based on fields */
  configurationId: string
  projectId: ProjectId
}

export type LayerDaTrackingConfig = {
  type: 'ethereum' | 'celestia' | 'avail'
  name: string
  url: string
  callsPerMinute: number
  batchSize: number
  startingBlock: number
}

export interface DataAvailabilityTrackingConfig2 {
  readonly layers: LayerDaTrackingConfig[]
  readonly projects: DaIndexedConfig[]
}
