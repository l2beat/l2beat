import type { Env } from '@l2beat/backend-tools'
import type { ChainConfig } from '@l2beat/config'
import {
  ConfigReader,
  type DiscoveryChainConfig,
  getDiscoveryPaths,
  getMulticall3Config,
} from '@l2beat/discovery'
import type { DiscordConfig, UpdateMonitorConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export function getUpdateMonitorConfig(
  env: Env,
  flags: FeatureFlags,
  chains: ChainConfig[],
  isLocal: boolean | undefined,
): UpdateMonitorConfig {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  return {
    configReader,
    paths,
    runOnStart: isLocal
      ? env.boolean('UPDATE_MONITOR_RUN_ON_START', true)
      : undefined,
    discord: getDiscordConfig(env, isLocal),
    chains: configReader
      .readAllChains()
      .filter((chain) => flags.isEnabled('updateMonitor', chain))
      .map((chain) => getChainDiscoveryConfig(env, chain, chains)),
    cacheEnabled: env.optionalBoolean(['DISCOVERY_CACHE_ENABLED']),
    cacheUri: env.string(['DISCOVERY_CACHE_URI'], 'postgres'),
    updateMessagesRetentionPeriodDays: env.integer(
      ['UPDATE_MESSAGES_RETENTION_PERIOD_DAYS'],
      30,
    ),
  }
}

function getDiscordConfig(env: Env, isLocal?: boolean): DiscordConfig | false {
  const token = env.optionalString('DISCORD_TOKEN')
  const internalChannelId = env.optionalString('INTERNAL_DISCORD_CHANNEL_ID')
  const publicChannelId = env.optionalString('PUBLIC_DISCORD_CHANNEL_ID')

  const discordEnabled =
    !!token && !!internalChannelId && (isLocal || !!publicChannelId)

  return (
    discordEnabled && {
      token,
      publicChannelId,
      internalChannelId,
      callsPerMinute: 3000,
    }
  )
}

function getChainDiscoveryConfig(
  env: Env,
  chain: string,
  chains: ChainConfig[],
): DiscoveryChainConfig {
  const chainConfig = chains.find((c) => c.name === chain)
  if (!chainConfig) {
    throw new Error('Unknown chain: ' + chain)
  }

  const multicallV3 = chainConfig.multicallContracts?.find(
    (x) => x.version === '3',
  )
  if (!multicallV3) {
    throw new Error('Missing multicallV3 for chain: ' + chain)
  }

  const explorerApi = chainConfig.apis.find(
    (x) => x.type === 'etherscan' || x.type === 'blockscout',
  )

  if (!explorerApi) {
    throw new Error('Missing explorerApi for chain: ' + chain)
  }

  const ENV_NAME = chain.toUpperCase()

  return {
    name: chainConfig.name,
    chainId: chainConfig.chainId,
    rpcUrl: env.string([
      `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
      `${ENV_NAME}_RPC_URL`,
    ]),
    eventRpcUrl: env.optionalString(`${ENV_NAME}_EVENT_RPC_URL_FOR_DISCOVERY`),
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
    multicall: getMulticall3Config(
      multicallV3.sinceBlock,
      multicallV3.address,
      multicallV3.batchSize,
    ),
    explorer:
      explorerApi.type === 'blockscout'
        ? {
            type: explorerApi.type,
            url: explorerApi.url,
            unsupported: {
              getContractCreation: explorerApi.contractCreationUnsupported,
            },
          }
        : {
            type: explorerApi.type,
            url: explorerApi.url,
            apiKey: env.string([
              `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_DISCOVERY`,
              `${ENV_NAME}_ETHERSCAN_API_KEY`,
            ]),
            unsupported: {
              getContractCreation: explorerApi.contractCreationUnsupported,
            },
          },
  }
}
