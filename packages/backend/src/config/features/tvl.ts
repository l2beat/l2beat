import {
  bridgeToBackendProject,
  chainConverter,
  getTvlAmountsConfig,
  getTvlPricesConfig,
  layer2ToBackendProject,
  layer3ToBackendProject,
} from '@l2beat/backend-shared'
import type { Env } from '@l2beat/backend-tools'
import { bridges, chains, layer2s, layer3s, tokenList } from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import type { TvlConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'
import { getChainTvlConfig, getChainsWithTokens } from './chains'

export function getTvlConfig(
  flags: FeatureFlags,
  env: Env,
  minTimestampOverride?: UnixTime,
): TvlConfig {
  const projects = layer2s
    .map(layer2ToBackendProject)
    .concat(bridges.map(bridgeToBackendProject))
    .concat(layer3s.map(layer3ToBackendProject))

  const sharedEscrowsChains = layer2s
    .filter((c) =>
      c.config.escrows.some(
        (e) =>
          e.sharedEscrow?.type === 'AggLayer' ||
          e.sharedEscrow?.type === 'ElasticChain',
      ),
    )
    .map((l) => l.id)

  const chainConfigs = uniq(
    getChainsWithTokens(tokenList, chains).concat(sharedEscrowsChains),
  ).map((chain) =>
    getChainTvlConfig(flags.isEnabled('tvl', chain), env, chain, {
      minTimestamp: minTimestampOverride,
    }),
  )

  return {
    amounts: getTvlAmountsConfig(projects),
    prices: getTvlPricesConfig(minTimestampOverride),
    chains: chainConfigs,
    chainConverter,
    maxTimestampsToAggregateAtOnce: env.integer(
      'MAX_TIMESTAMPS_TO_AGGREGATE_AT_ONCE',
      100,
    ),
    projects,
    projectsExcludedFromApi:
      env.optionalString('TVL_PROJECTS_EXCLUDED_FROM_API')?.split(' ') ?? [],
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
  }
}
