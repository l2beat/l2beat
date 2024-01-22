import { MulticallConfig } from '../discovery/provider/multicall/types'
import { EthereumAddress } from '../utils/EthereumAddress'
import { EtherscanUnsupportedMethods } from '../utils/EtherscanLikeClient'

export interface DiscoveryCliConfig {
  discovery: DiscoveryModuleConfig | false
  singleDiscovery: SingleDiscoveryModuleConfig | false
  chain: DiscoveryChainConfig
  invert: InversionConfig | false
}

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly chain: string
  readonly dryRun?: boolean
  readonly dev?: boolean
  readonly blockNumber?: number
  readonly getLogsMaxRange?: number
  readonly sourcesFolder?: string
  readonly discoveryFilename?: string
}

export interface SingleDiscoveryModuleConfig {
  readonly address: EthereumAddress
  readonly chain: string
}

export interface DiscoveryChainConfig {
  chain: string
  rpcUrl: string
  rpcGetLogsMaxRange?: number
  multicall: MulticallConfig
  etherscanApiKey: string
  etherscanUrl: string
  etherscanUnsupported?: EtherscanUnsupportedMethods
}

export interface InversionConfig {
  readonly project: string
  readonly useMermaidMarkup: boolean
  readonly chain: string
}
