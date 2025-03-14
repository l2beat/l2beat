import { getTvlAmountsConfig, getTvlPricesConfig } from '@l2beat/backend-shared'
import type { Env } from '@l2beat/backend-tools'
import type { ChainConfig, ProjectService } from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import { toMulticallConfigEntry } from '../../peripherals/multicall/MulticallConfig'
import type { ChainTvlConfig, TvlConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getTvlConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  env: Env,
  chains: ChainConfig[],
  minTimestampOverride?: UnixTime,
): Promise<TvlConfig> {
  const projects = await ps.getProjects({
    select: ['tvlConfig'],
    optional: ['chainConfig'],
  })
  const tokenList = await ps.getTokens()

  const tvlChainNames = new Set<string>()
  for (const { chainName } of tokenList) {
    tvlChainNames.add(chainName)
  }
  for (const project of projects) {
    if (project.tvlConfig.escrows.some((e) => e.sharedEscrow)) {
      if (project.chainConfig) {
        tvlChainNames.add(project.chainConfig.name)
      }
    }
  }

  const chainConfigs = chains
    .filter((c) => tvlChainNames.has(c.name) && flags.isEnabled('tvl', c.name))
    .map((chain) => getChainTvlConfig(env, chain, minTimestampOverride))

  return {
    amounts: getTvlAmountsConfig(projects, chains, tokenList),
    prices: getTvlPricesConfig(chains, tokenList, minTimestampOverride),
    chains: chainConfigs,
    maxTimestampsToAggregateAtOnce: env.integer(
      'MAX_TIMESTAMPS_TO_AGGREGATE_AT_ONCE',
      100,
    ),
    projects,
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
  }
}

const DEFAULT_RPC_CALLS_PER_MINUTE = 60

export function getChainTvlConfig(
  env: Env,
  chain: ChainConfig,
  minTimestampOverride?: UnixTime,
): ChainTvlConfig {
  if (!chain.sinceTimestamp) {
    throw new Error('Missing sinceTimestamp for chain: ' + chain)
  }

  const rpcApi = chain.apis.find((x) => x.type === 'rpc')
  const explorerApi = chain.apis.find(
    (x) => x.type === 'etherscan' || x.type === 'blockscout',
  )

  const ENV_NAME = chain.name.toUpperCase()
  return {
    name: chain.name,
    providerUrl: env.string(
      [`${ENV_NAME}_RPC_URL_FOR_TVL`, `${ENV_NAME}_RPC_URL`],
      rpcApi?.url,
    ),
    providerCallsPerMinute: env.integer(
      [
        `${ENV_NAME}_RPC_CALLS_PER_MINUTE_FOR_TVL`,
        `${ENV_NAME}_RPC_CALLS_PER_MINUTE`,
      ],
      rpcApi?.callsPerMinute ?? DEFAULT_RPC_CALLS_PER_MINUTE,
    ),
    blockExplorerConfig: explorerApi
      ? explorerApi.type === 'etherscan'
        ? {
            type: explorerApi.type,
            apiKey: env.string([
              `${ENV_NAME}_ETHERSCAN_API_KEY_FOR_TVL`,
              `${ENV_NAME}_ETHERSCAN_API_KEY`,
            ]),
            url: explorerApi.url,
          }
        : { type: explorerApi.type, url: explorerApi.url }
      : undefined,
    minBlockTimestamp: minTimestampOverride ?? chain.sinceTimestamp,
    multicallConfig: (chain.multicallContracts ?? []).map(
      toMulticallConfigEntry,
    ),
  }
}
