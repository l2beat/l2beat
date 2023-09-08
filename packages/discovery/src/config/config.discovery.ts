import { ArbiscanClient, EtherscanClient, getEnv } from '@l2beat/shared'
import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'

export function getDiscoveryCliConfig(cli: CliParameters): DiscoveryCliConfig {
  dotenv()
  if (
    cli.mode !== 'invert' &&
    cli.mode !== 'discover' &&
    cli.mode !== 'single-discovery'
  ) {
    throw new Error(`No local config for mode: ${cli.mode}`)
  }

  const discoveryEnabled = cli.mode === 'discover'
  const singleDiscoveryEnabled = cli.mode === 'single-discovery'
  const invertEnabled = cli.mode === 'invert'

  return {
    invert: invertEnabled && {
      project: cli.project,
      chainId: cli.chain,
      useMermaidMarkup: cli.useMermaidMarkup,
    },
    discovery: discoveryEnabled && {
      project: cli.project,
      chainId: cli.chain,
      dryRun: cli.dryRun,
      dev: cli.dev,
      blockNumber: getEnv.optionalInteger('DISCOVERY_BLOCK_NUMBER'),
    },
    singleDiscovery: singleDiscoveryEnabled && {
      address: cli.address,
      chainId: cli.chain,
    },
    chain: getChainConfig(cli.chain),
  }
}

function getChainConfig(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return {
        chainId: ChainId.ETHEREUM,
        rpcUrl: getEnv('DISCOVERY_ETHEREUM_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY'),
        etherscanUrl: EtherscanClient.API_URL,
      }
    case ChainId.ARBITRUM:
      return {
        chainId: ChainId.ARBITRUM,
        rpcUrl: getEnv('DISCOVERY_ARBITRUM_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_ARBITRUM_ETHERSCAN_API_KEY'),
        etherscanUrl: ArbiscanClient.API_URL,
      }
    case ChainId.OPTIMISM:
      return {
        chainId: ChainId.OPTIMISM,
        rpcUrl: getEnv('DISCOVERY_OPTIMISM_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_OPTIMISM_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api-optimistic.etherscan.io/api',
      }
    case ChainId.POLYGON_POS:
      return {
        chainId: ChainId.POLYGON_POS,
        rpcUrl: getEnv('DISCOVERY_POLYGON_POS_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_POLYGON_POS_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.polygonscan.com/api',
      }
    case ChainId.BSC:
      return {
        chainId: ChainId.BSC,
        rpcUrl: getEnv('DISCOVERY_BSC_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_BSC_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.bscscan.com/api',
      }
    case ChainId.AVALANCHE:
      return {
        chainId: ChainId.AVALANCHE,
        rpcUrl: getEnv('DISCOVERY_AVALANCHE_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_AVALANCHE_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.snowtrace.io/api',
      }
    case ChainId.CELO:
      return {
        chainId: ChainId.CELO,
        rpcUrl: getEnv('DISCOVERY_CELO_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_CELO_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.celoscan.io/api',
      }
    case ChainId.LINEA:
      return {
        chainId: ChainId.LINEA,
        rpcUrl: getEnv('DISCOVERY_LINEA_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_LINEA_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.lineascan.build/api',
      }
    case ChainId.BASE:
      return {
        chainId: ChainId.BASE,
        rpcUrl: getEnv('DISCOVERY_BASE_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_BASE_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.basescan.org/api',
      }
    case ChainId.POLYGON_ZKEVM:
      return {
        chainId: ChainId.POLYGON_ZKEVM,
        rpcUrl: getEnv('DISCOVERY_POLYGON_ZKEVM_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_POLYGON_ZKEVM_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api-zkevm.polygonscan.com/api',
      }
    case ChainId.GNOSIS:
      return {
        chainId: ChainId.GNOSIS,
        rpcUrl: getEnv('DISCOVERY_GNOSIS_RPC_URL'),
        etherscanApiKey: getEnv('DISCOVERY_GNOSIS_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.gnosisscan.io/api',
      }
    case ChainId.NMV:
      throw new Error('NMV is not supported')
    default:
      throw new Error(`No config for chain: ${ChainId.getName(chainId)}`)
  }
}

export interface DiscoveryCliConfig {
  discovery: DiscoveryModuleConfig | false
  singleDiscovery: SingleDiscoveryModuleConfig | false
  chain: DiscoveryChainConfig
  invert: InversionConfig | false
}

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly chainId: ChainId
  readonly dryRun?: boolean
  readonly dev?: boolean
  readonly blockNumber?: number
}

export interface SingleDiscoveryModuleConfig {
  readonly address: EthereumAddress
  readonly chainId: ChainId
}

export interface DiscoveryChainConfig {
  chainId: ChainId
  rpcUrl: string
  etherscanApiKey: string
  etherscanUrl: string
}

export interface InversionConfig {
  readonly project: string
  readonly useMermaidMarkup: boolean
  readonly chainId: ChainId
}
