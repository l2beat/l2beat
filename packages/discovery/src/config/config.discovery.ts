import { getEnv } from '@l2beat/backend-tools'
import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'
import { chains } from './chains'
import { DiscoveryChainConfig, DiscoveryCliConfig } from './types'

export function getDiscoveryCliConfig(cli: CliParameters): DiscoveryCliConfig {
  dotenv()

  if (
    cli.mode !== 'invert' &&
    cli.mode !== 'discover' &&
    cli.mode !== 'flatten' &&
    cli.mode !== 'single-discovery'
  ) {
    throw new Error(`No local config for mode: ${cli.mode}`)
  }

  const discoveryEnabled = cli.mode === 'discover'
  const singleDiscoveryEnabled = cli.mode === 'single-discovery'
  const invertEnabled = cli.mode === 'invert'
  const flattenEnabled = cli.mode === 'flatten'

  return {
    invert: invertEnabled && {
      project: cli.project,
      chain: getChainConfig(cli.chain),
      useMermaidMarkup: cli.useMermaidMarkup,
    },
    discovery: discoveryEnabled && {
      project: cli.project,
      chain: getChainConfig(cli.chain),
      dryRun: cli.dryRun,
      dev: cli.dev,
      blockNumber: cli.blockNumber,
      sourcesFolder: cli.sourcesFolder,
      flatSourcesFolder: cli.flatSourcesFolder,
      discoveryFilename: cli.discoveryFilename,
    },
    singleDiscovery: singleDiscoveryEnabled && {
      address: cli.address,
      chain: getChainConfig(cli.chain),
    },
    flatten: flattenEnabled && {
      path: cli.path,
      rootContractName: cli.rootContractName,
    },
  }
}

export function getChainConfig(chain: string): DiscoveryChainConfig {
  const env = getEnv()

  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) {
    throw new Error(`No config for chain: ${chain}`)
  }

  const ENV_NAME = chainConfig.name.toUpperCase()
  return {
    name: chainConfig.name,
    rpcUrl: env.string([
      `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_URL`,
      //support for legacy local configs
      `DISCOVERY_${ENV_NAME}_RPC_URL`,
    ]),
    rpcGetLogsMaxRange: env.optionalInteger([
      `${ENV_NAME}_RPC_GETLOGS_MAX_RANGE_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_GETLOGS_MAX_RANGE`,
      //support for legacy local configs
      `DISCOVERY_${ENV_NAME}_RPC_GETLOGS_MAX_RANGE`,
    ]),
    reorgSafeDepth: env.optionalInteger([
      `${ENV_NAME}_REORG_SAFE_DEPTH_FOR_DISCOVERY`,
      `${ENV_NAME}_REORG_SAFE_DEPTH`,
    ]),
    multicall: chainConfig.multicall,
    etherscanApiKey: env.string([
      `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_DISCOVERY`,
      `${ENV_NAME}_ETHERSCAN_API_KEY`,
      //support for legacy local configs
      `DISCOVERY_${ENV_NAME}_ETHERSCAN_API_KEY`,
    ]),
    etherscanUrl: chainConfig.etherscanUrl,
    etherscanUnsupported: chainConfig.etherscanUnsupported,
  }
}
