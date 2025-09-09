import type { MulticallConfig } from '../discovery/provider/multicall/types'
import type { ExplorerConfig } from '../utils/IEtherscanClient'

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly dryRun?: boolean
  readonly dev?: boolean
  readonly overwriteCache: boolean
  readonly printStats?: boolean
  readonly verboseTemplatization?: boolean
  readonly saveSources?: boolean
  readonly blockNumber?: number
  readonly timestamp?: number
  readonly sourcesFolder?: string
  readonly flatSourcesFolder?: string
  readonly discoveryFilename?: string
  readonly templateSimilarityCutoff?: number
}

export interface DiscoveryChainConfig {
  name: string
  chainId?: number
  rpcUrl: string
  eventRpcUrl?: string
  reorgSafeDepth?: number
  beaconApiUrl?: string
  coingeckoApiKey?: string
  celestiaApiUrl?: string
  multicall: MulticallConfig | undefined
  explorer: ExplorerConfig
}
