import { getTvlAmountsConfig, getTvlPricesConfig } from '@l2beat/backend-shared'
import type { Env } from '@l2beat/backend-tools'
import {
  type ChainConfig,
  type ProjectService,
  tokenList,
} from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import type { TvlConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'
import { getChainTvlConfig, getChainsWithTokens } from './chains'

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

  const sharedEscrowsChains = projects
    .filter((c) =>
      c.tvlConfig.escrows.some(
        (e) =>
          e.sharedEscrow?.type === 'AggLayer' ||
          e.sharedEscrow?.type === 'ElasticChain',
      ),
    )
    .map((l) => l.id)

  const chainConfigs = uniq(
    getChainsWithTokens(tokenList).concat(sharedEscrowsChains),
  ).map((chain) =>
    getChainTvlConfig(flags.isEnabled('tvl', chain), env, chain, chains, {
      minTimestamp: minTimestampOverride,
    }),
  )

  return {
    amounts: getTvlAmountsConfig(projects, chains),
    prices: getTvlPricesConfig(chains, minTimestampOverride),
    chains: chainConfigs,
    maxTimestampsToAggregateAtOnce: env.integer(
      'MAX_TIMESTAMPS_TO_AGGREGATE_AT_ONCE',
      100,
    ),
    projects,
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
  }
}
