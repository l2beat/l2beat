import type { ProjectDefiTvlConfig } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

export interface DefiTvlDataSource {
  name: string
  url?: string
  scope?: string
}

/** Returns undefined for L2BEAT's own data, which needs no attribution. */
export function getDefiTvlDataSource(
  tvl: ProjectDefiTvlConfig,
): DefiTvlDataSource | undefined {
  switch (tvl.source) {
    case 'l2beat':
      return undefined
    case 'defillama':
      return {
        name: 'DeFiLlama',
        url: `https://defillama.com/protocol/${tvl.protocolSlug}`,
        scope: `Tracked chains: ${tvl.chains
          .map((chain) => chain.providerChain)
          .join(', ')}`,
      }
    default:
      return assertUnreachable(tvl)
  }
}
