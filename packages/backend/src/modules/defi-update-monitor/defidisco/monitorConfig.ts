import type { Env } from '@l2beat/backend-tools'
import {
  ConfigReader,
  type DiscoveryChainConfig,
  getDiscoveryPaths,
  type DiscoveryPaths,
  getMulticall3Config,
} from '@l2beat/discovery'
import type { DefiscanEndpointsConfig } from '@l2beat/defiscan-endpoints/build/config'
import type { DiscordConfig } from '../../../config/Config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import * as fs from 'fs'
import * as path from 'path'

export interface MonitorConfig {
  database: {
    connectionString: string
    ssl: boolean
  }
  discord: DiscordConfig | false
  discovery: {
    chains: DiscoveryChainConfig[]
    cacheEnabled: boolean
    cacheUri: string
    paths: DiscoveryPaths
    configReader: ConfigReader
  }
  defiscanEndpoints: DefiscanEndpointsConfig
  projects: string[]
  runOnStart: boolean
  logLevel: string
}

interface DefidiscoConfigFile {
  defiProjects: string[]
}

function readProjectList(paths: DiscoveryPaths): string[] {
  const configPath = path.join(paths.discovery, '..', 'defidisco-config.json')
  try {
    const content = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(content) as DefidiscoConfigFile
    return config.defiProjects
  } catch (error) {
    throw new Error(
      `Failed to read defidisco-config.json at ${configPath}: ${error}`,
    )
  }
}

function getDiscordConfig(env: Env): DiscordConfig | false {
  const token = env.optionalString('DISCORD_TOKEN')
  const channelId = env.optionalString('DISCORD_CHANNEL_ID')

  if (!token || !channelId) {
    return false
  }

  return {
    token,
    // Single channel — both PUBLIC and INTERNAL point to the same channel
    publicChannelId: channelId,
    internalChannelId: channelId,
    callsPerMinute: 3000,
  }
}

/**
 * Builds a DiscoveryChainConfig for a given chain name from env vars.
 *
 * For Ethereum (our primary chain), this uses well-known values for
 * multicall3 and etherscan. For other chains in the future, env vars
 * provide the chain-specific RPC URLs and explorer configs.
 */
function getChainDiscoveryConfig(
  env: Env,
  chainName: string,
): DiscoveryChainConfig {
  const ENV_NAME = chainName.toUpperCase()

  // Ethereum multicall3 is deployed at a well-known address (default in getMulticall3Config)
  const multicallConfig =
    chainName === 'ethereum'
      ? getMulticall3Config(14353601)
      : undefined

  return {
    name: chainName,
    chainId: chainName === 'ethereum' ? 1 : 0,
    rpcUrl: env.string([
      `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_URL`,
    ]),
    eventRpcUrl: env.optionalString(
      `${ENV_NAME}_EVENT_RPC_URL_FOR_DISCOVERY`,
    ),
    reorgSafeDepth: env.optionalInteger([
      `${ENV_NAME}_REORG_SAFE_DEPTH_FOR_DISCOVERY`,
      `${ENV_NAME}_REORG_SAFE_DEPTH`,
    ]),
    beaconApiUrl: env.optionalString([
      'ETHEREUM_BEACON_API_URL_FOR_DISCOVERY',
      'ETHEREUM_BEACON_API_URL',
    ]),
    celestiaApiUrl: env.optionalString([
      'CELESTIA_API_URL_FOR_DISCOVERY',
      'CELESTIA_API_URL',
    ]),
    coingeckoApiKey: env.optionalString([
      'COINGECKO_API_KEY_FOR_DISCOVERY',
      'COINGECKO_API_KEY',
    ]),
    multicall: multicallConfig,
    explorer: {
      type: 'etherscan' as const,
      url: 'https://api.etherscan.io/v2/api',
      apiKey: env.string('ETHERSCAN_API_KEY'),
      chainId: chainName === 'ethereum' ? 1 : 0,
    },
  }
}

function discoverChains(
  env: Env,
  projects: string[],
  configReader: ConfigReader,
): DiscoveryChainConfig[] {
  // Determine which chains are needed from the project discoveries
  const chainNames = new Set<string>()
  for (const project of projects) {
    try {
      const discovery = configReader.readDiscovery(project)
      for (const entry of discovery.entries) {
        const chain = ChainSpecificAddress.longChain(entry.address)
        chainNames.add(chain)
      }
    } catch {
      // Project may not have been discovered yet — skip
    }
  }

  // Default to ethereum if no chains found
  if (chainNames.size === 0) {
    chainNames.add('ethereum')
  }

  return Array.from(chainNames).map((chain) =>
    getChainDiscoveryConfig(env, chain),
  )
}

export function getMonitorConfig(env: Env): MonitorConfig {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const projects = readProjectList(paths)

  const defiscanPort = env.integer('DEFISCAN_ENDPOINTS_PORT', 3001)

  return {
    database: {
      connectionString: env.string('DATABASE_URL'),
      ssl: env.boolean('DATABASE_SSL', false),
    },
    discord: getDiscordConfig(env),
    discovery: {
      chains: discoverChains(env, projects, configReader),
      cacheEnabled: env.boolean('DISCOVERY_CACHE_ENABLED', true),
      cacheUri: env.string('DISCOVERY_CACHE_URI', 'postgres'),
      paths,
      configReader,
    },
    defiscanEndpoints: {
      port: defiscanPort,
      logLevel: env.string('LOG_LEVEL', 'INFO'),
      debank: {
        apiKey: env.string('DEBANK_API_KEY'),
        baseUrl: env.string(
          'DEBANK_BASE_URL',
          'https://pro-openapi.debank.com',
        ),
        callsPerMinute: env.integer('DEBANK_RATE_LIMIT', 60),
        enabled: true,
      },
      cache: {
        balancesTTL: env.integer('CACHE_BALANCES_TTL', 3600),
        positionsTTL: env.integer('CACHE_POSITIONS_TTL', 3600),
      },
      rpc: {
        url:
          env.optionalString('ETHEREUM_RPC_URL_FOR_DISCOVERY') ??
          env.optionalString('ETHEREUM_RPC_URL') ??
          '',
      },
    },
    projects,
    runOnStart: env.boolean('RUN_ON_START', true),
    logLevel: env.string('LOG_LEVEL', 'INFO'),
  }
}
