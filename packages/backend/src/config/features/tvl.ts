import { Env } from '@l2beat/backend-tools'
import {
  bridgeToBackendProject,
  bridges,
  chainConverter,
  chains,
  getTvlAmountsConfig,
  getTvlPricesConfig,
  layer2ToBackendProject,
  layer2s,
  layer3ToBackendProject,
  layer3s,
  tokenList,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

import { uniq } from 'lodash'
import { TvlConfig } from '../Config'
import { FeatureFlags } from '../FeatureFlags'
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

  const aggLayerChains = layer2s
    .filter((c) =>
      c.config.escrows.some((e) => e.sharedEscrow?.type === 'AggLayer'),
    )
    .map((l) => l.id)

  const chainConfigs = uniq(
    getChainsWithTokens(tokenList, chains).concat(aggLayerChains),
  ).map((chain) =>
    getChainTvlConfig(flags.isEnabled('tvl', chain), env, chain, {
      minTimestamp: minTimestampOverride,
    }),
  )

  return {
    amounts: getTvlAmountsConfig(projects),
    prices: getTvlPricesConfig(minTimestampOverride),
    chains: chainConfigs,
    coingeckoApiKey: env.optionalString(['COINGECKO_API_KEY']),
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
