import type { Env } from '@l2beat/backend-tools'
import type { ChainConfig } from '@l2beat/config'
import {
  ConfigReader,
  type DiscoveryChainConfig,
  type ExplorerConfig,
  getDiscoveryPaths,
  getMulticall3Config,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { UpdateMonitorConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export function getUpdateMonitorConfig(
  env: Env,
  flags: FeatureFlags,
  chains: ChainConfig[],
  isLocal: boolean | undefined,
): UpdateMonitorConfig {
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)

  const allChains = [
    ...new Set(
      configReader
        .readAllDiscoveredProjects()
        .flatMap((project) => configReader.readDiscovery(project).entries)
        .map((entry) => ChainSpecificAddress.longChain(entry.address)),
    ),
  ]
  const enabledChains = allChains.filter((chain) =>
    flags.isEnabled('updateMonitor', 'chain', chain),
  )
  const disabledChains = allChains.filter(
    (chain) => !flags.isEnabled('updateMonitor', 'chain', chain),
  )

  const allProjects = configReader.readAllDiscoveredProjects()
  const disabledProjects = allProjects.filter(
    (project) => !flags.isEnabled('updateMonitor', 'project', project),
  )

  return {
    configReader,
    paths,
    runOnStart: isLocal
      ? env.boolean('UPDATE_MONITOR_RUN_ON_START', true)
      : undefined,
    updateDifferEnabled: flags.isEnabled('updateMonitor', 'updateDiffer'),
    chains: enabledChains.map((chain) =>
      getChainDiscoveryConfig(env, chain, chains),
    ),
    disabledChains,
    disabledProjects,
    cacheEnabled: env.optionalBoolean(['DISCOVERY_CACHE_ENABLED']),
    cacheUri: env.string(['DISCOVERY_CACHE_URI'], 'postgres'),
    updateMessagesRetentionPeriodDays: env.integer(
      ['UPDATE_MESSAGES_RETENTION_PERIOD_DAYS'],
      30,
    ),
    workerPool: {
      workerCount: env.integer(['UPDATE_MONITOR_WORKER_POOL_COUNT'], 3),
      timeoutPerTaskMs: env.integer(
        ['UPDATE_MONITOR_WORKER_POOL_TIMEOUT_PER_TASK_MS'],
        20 * 60 * 1000, // 10 minutes
      ),
      timeoutPerRunMs: env.integer(
        ['UPDATE_MONITOR_WORKER_POOL_TIMEOUT_PER_RUN_MS'],
        60 * 60 * 1000, // 1 hour
      ),
    },
  }
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

  const multicallConfig = multicallV3
    ? getMulticall3Config(
        multicallV3.sinceBlock,
        multicallV3.address,
        multicallV3.batchSize,
      )
    : undefined

  const explorer: ExplorerConfig[] = []

  for (const api of chainConfig.apis) {
    switch (api.type) {
      case 'blockscout':
      case 'routescan':
        explorer.push({
          type: api.type,
          url: api.url,
          unsupported: {
            getContractCreation: api.contractCreationUnsupported,
          },
        })
        break
      case 'sourcify':
        explorer.push({
          type: api.type,
          chainId: api.chainId,
        })
        break
      case 'etherscan':
        explorer.push({
          type: api.type,
          url: api.customUrl ?? env.string('ETHERSCAN_API_URL'),
          apiKey: api.customUrl
            ? ''
            : env.string([
                'ETHERSCAN_API_KEY_FOR_DISCOVERY',
                'ETHERSCAN_API_KEY',
              ]),
          chainId: api.chainId,
          unsupported: {
            getContractCreation: api.contractCreationUnsupported,
          },
        })
        break
      default:
        break
    }
  }

  if (explorer.length === 0) {
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
    coingeckoApiKey: env.optionalString([
      'COINGECKO_API_KEY_FOR_DISCOVERY',
      'COINGECKO_API_KEY',
    ]),
    multicall: multicallConfig,
    explorer,
  }
}
