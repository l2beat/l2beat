import type { Logger } from '@l2beat/backend-tools'
import type { IProvider } from '@l2beat/discovery'
import { type CoingeckoId, InMemoryCache } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { getTokensOnChain, type Token } from '../estimateTVL'

const TTL_SECONDS = 60 * 60

// getCoinsMarket does not paginate, so ids have to be split by the page size.
const IDS_PER_REQUEST = 250

export type Prices = Record<string, number>

export class TvlCache {
  private readonly cache = new InMemoryCache({})

  getTokens(logger: Logger, chainName: string): Promise<Token[]> {
    return this.cache.get(
      { key: ['tvl-tokens', chainName], ttl: TTL_SECONDS },
      () => getTokensOnChain(logger, chainName),
    )
  }

  getPrices(provider: IProvider, tokens: Token[]): Promise<Prices> {
    return this.cache.get(
      { key: ['tvl-prices', provider.chain], ttl: TTL_SECONDS },
      () => fetchPrices(provider, tokens),
    )
  }
}

async function fetchPrices(
  provider: IProvider,
  tokens: Token[],
): Promise<Prices> {
  const ids = unique(tokens.map((token) => token.coingeckoId))
  const chunks = toChunks(ids, IDS_PER_REQUEST)
  const responses = await Promise.all(
    chunks.map((chunk) => getCoinsMarket(provider, chunk)),
  )

  const prices: Prices = {}
  for (const entry of responses.flat()) {
    if (entry.current_price === null) continue
    prices[entry.id] = entry.current_price
  }
  return prices
}

function getCoinsMarket(provider: IProvider, coingeckoIds: CoingeckoId[]) {
  const idsHash = utils.id(coingeckoIds.join(','))
  return provider.raw(
    `coins-market-${provider.chain}-${provider.blockNumber}-${idsHash}`,
    ({ coingeckoClient }) =>
      coingeckoClient.getCoinsMarket(coingeckoIds, 'usd'),
  )
}

function unique(ids: CoingeckoId[]): CoingeckoId[] {
  return [...new Set(ids.map((id) => id.toString()))] as CoingeckoId[]
}

function toChunks<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}
