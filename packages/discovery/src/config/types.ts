import { EthereumAddress } from '@l2beat/shared-pure'

import { MulticallConfig } from '../discovery/provider/multicall/types'
import { EtherscanUnsupportedMethods } from '../utils/EtherscanLikeClient'

export interface DiscoveryCliConfig {
  discovery: DiscoveryModuleConfig | false
  singleDiscovery: SingleDiscoveryModuleConfig | false
  invert: InversionConfig | false
  flatten: FlattenConfig | false
}

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly chain: DiscoveryChainConfig
  readonly dryRun?: boolean
  readonly dev?: boolean
  readonly printStats?: boolean
  readonly blockNumber?: number
  readonly sourcesFolder?: string
  readonly flatSourcesFolder?: string
  readonly discoveryFilename?: string
}

export interface SingleDiscoveryModuleConfig {
  readonly address: EthereumAddress
  readonly chain: DiscoveryChainConfig
}

export interface DiscoveryChainConfig {
  name: string
  rpcUrl: string
  eventRpcUrl?: string
  reorgSafeDepth?: number
  multicall: MulticallConfig
  etherscanApiKey: string
  etherscanUrl: string
  etherscanUnsupported?: EtherscanUnsupportedMethods
}

export interface InversionConfig {
  readonly project: string
  readonly useMermaidMarkup: boolean
  readonly chain: DiscoveryChainConfig
}

export interface FlattenConfig {
  readonly path: string
  readonly rootContractName: string
}
