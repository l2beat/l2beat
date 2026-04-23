import type { Env } from '@l2beat/backend-tools'
import {
  ConfigReader,
  type DiscoveryChainConfig,
  getChainConfig,
  getDiscoveryPaths,
  type DiscoveryPaths,
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

function discoverChains(
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

  return Array.from(chainNames).map((chain) => getChainConfig(chain))
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
      chains: discoverChains(projects, configReader),
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
      thegraph: {
        apiKey: env.optionalString('THEGRAPH_API_KEY') ?? '',
      },
    },
    projects,
    runOnStart: env.boolean('RUN_ON_START', true),
    logLevel: env.string('LOG_LEVEL', 'INFO'),
  }
}
