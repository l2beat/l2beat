import { getChainConfig, type IProvider } from '@l2beat/discovery'
import { InMemoryCache } from '@l2beat/shared-pure'
import { getProvider } from '../common/GetProvider'

// A provider is pinned to the block it was created at, so this doubles as the
// staleness bound of everything read through it. Keeping the block stable is
// what lets the on-disk discovery cache, which is keyed by block number, hit.
const TTL_SECONDS = 60 * 60

export class ProviderCache {
  private readonly cache = new InMemoryCache({})

  get(chainName: string): Promise<IProvider> {
    return this.cache.get(
      { key: ['discovery-ui-provider', chainName], ttl: TTL_SECONDS },
      () => {
        const chain = getChainConfig(chainName)
        return getProvider(
          chain.rpcUrl,
          chain.explorer,
          chainName,
          chain.multicall,
          chain.coingeckoApiKey,
        )
      },
    )
  }
}
