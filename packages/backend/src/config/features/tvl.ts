import {
  chainConverter,
  getTvlAmountsConfig,
  getTvlPricesConfig,
  toBackendProject,
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
  const projects = [...layer2s, ...layer3s, ...bridges].map(toBackendProject)

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
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
  }
}
