import { getEnv } from '@l2beat/backend-tools'
import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'
import { multicallConfig } from '../discovery/provider/multicall/MulticallConfig'
import { MulticallConfig } from '../discovery/provider/multicall/types'
import { ChainId } from '../utils/ChainId'
import { EthereumAddress } from '../utils/EthereumAddress'
import { EtherscanUnsupportedMethods } from '../utils/EtherscanLikeClient'

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
  const chain = getChainConfig(cli.chain)

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
      blockNumber: cli.blockNumber,
      getLogsMaxRange: chain.rpcGetLogsMaxRange,
      sourcesFolder: cli.sourcesFolder,
      discoveryFilename: cli.discoveryFilename,
    },
    singleDiscovery: singleDiscoveryEnabled && {
      address: cli.address,
      chainId: cli.chain,
    },
    chain,
  }
}

export function getChainConfig(chainId: ChainId): DiscoveryChainConfig {
  const env = getEnv()

  switch (chainId) {
    case ChainId.ETHEREUM:
      return {
        chainId: ChainId.ETHEREUM,
        rpcUrl: env.string('DISCOVERY_ETHEREUM_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_ETHEREUM_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.ethereum,
        etherscanApiKey: env.string('DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.etherscan.io/api',
      }
    case ChainId.ARBITRUM:
      return {
        chainId: ChainId.ARBITRUM,
        rpcUrl: env.string('DISCOVERY_ARBITRUM_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_ARBITRUM_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.arbitrum,
        etherscanApiKey: env.string('DISCOVERY_ARBITRUM_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.arbiscan.io/api',
      }
    case ChainId.OPTIMISM:
      return {
        chainId: ChainId.OPTIMISM,
        rpcUrl: env.string('DISCOVERY_OPTIMISM_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_OPTIMISM_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.optimism,
        etherscanApiKey: env.string('DISCOVERY_OPTIMISM_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api-optimistic.etherscan.io/api',
      }
    case ChainId.POLYGONPOS:
      return {
        chainId: ChainId.POLYGONPOS,
        rpcUrl: env.string('DISCOVERY_POLYGONPOS_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_POLYGONPOS_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.polygonpos,
        etherscanApiKey: env.string('DISCOVERY_POLYGONPOS_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.polygonscan.com/api',
      }
    case ChainId.BSC:
      return {
        chainId: ChainId.BSC,
        rpcUrl: env.string('DISCOVERY_BSC_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_BSC_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.bsc,
        etherscanApiKey: env.string('DISCOVERY_BSC_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.bscscan.com/api',
      }
    case ChainId.AVALANCHE:
      return {
        chainId: ChainId.AVALANCHE,
        rpcUrl: env.string('DISCOVERY_AVALANCHE_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_AVALANCHE_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.avalanche,
        etherscanApiKey: env.string('DISCOVERY_AVALANCHE_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.snowtrace.io/api',
      }
    case ChainId.CELO:
      return {
        chainId: ChainId.CELO,
        rpcUrl: env.string('DISCOVERY_CELO_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_CELO_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.celo,
        etherscanApiKey: env.string('DISCOVERY_CELO_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.celoscan.io/api',
        etherscanUnsupported: {
          getContractCreation: true,
        },
      }
    case ChainId.LINEA:
      return {
        chainId: ChainId.LINEA,
        rpcUrl: env.string('DISCOVERY_LINEA_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_LINEA_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.linea,
        etherscanApiKey: env.string('DISCOVERY_LINEA_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.lineascan.build/api',
      }
    case ChainId.BASE:
      return {
        chainId: ChainId.BASE,
        rpcUrl: env.string('DISCOVERY_BASE_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_BASE_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.base,
        etherscanApiKey: env.string('DISCOVERY_BASE_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.basescan.org/api',
      }
    case ChainId.POLYGONZKEVM:
      return {
        chainId: ChainId.POLYGONZKEVM,
        rpcUrl: env.string('DISCOVERY_POLYGONZKEVM_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_POLYGONZKEVM_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.polygonzkevm,
        etherscanApiKey: env.string('DISCOVERY_POLYGONZKEVM_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api-zkevm.polygonscan.com/api',
      }
    case ChainId.GNOSIS:
      return {
        chainId: ChainId.GNOSIS,
        rpcUrl: env.string('DISCOVERY_GNOSIS_RPC_URL'),
        rpcGetLogsMaxRange: env.optionalInteger(
          'DISCOVERY_GNOSIS_RPC_GETLOGS_MAX_RANGE',
        ),
        multicall: multicallConfig.gnosis,
        etherscanApiKey: env.string('DISCOVERY_GNOSIS_ETHERSCAN_API_KEY'),
        etherscanUrl: 'https://api.gnosisscan.io/api',
        etherscanUnsupported: {
          getContractCreation: true,
        },
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
  readonly getLogsMaxRange?: number
  readonly sourcesFolder?: string
  readonly discoveryFilename?: string
}

export interface SingleDiscoveryModuleConfig {
  readonly address: EthereumAddress
  readonly chainId: ChainId
}

export interface DiscoveryChainConfig {
  chainId: ChainId
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
  readonly chainId: ChainId
}
