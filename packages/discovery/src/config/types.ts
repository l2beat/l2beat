import { MulticallConfig } from '../discovery/provider/multicall/types'
import { ExplorerConfig } from '../utils/IEtherscanClient'

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly chain: DiscoveryChainConfig
  readonly dryRun?: boolean
  readonly dev?: boolean
  readonly printStats?: boolean
  readonly saveSources?: boolean
  readonly blockNumber?: number
  readonly sourcesFolder?: string
  readonly flatSourcesFolder?: string
  readonly discoveryFilename?: string
  readonly printTemplateSimilarity?: boolean
  readonly templateSimilarityCutoff?: number
}

export interface DiscoveryChainConfig {
  name: string
  chainId?: number
  rpcUrl: string
  eventRpcUrl?: string
  reorgSafeDepth?: number
  beaconApiUrl?: string
  multicall: MulticallConfig
  explorer: ExplorerConfig
}
