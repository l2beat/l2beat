import type { IProvider } from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  CoingeckoId,
  InMemoryCache,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { Token } from '../estimateTVL'
import { type BackendToken, fetchTokens } from './tokenBackend'

const TTL_SECONDS = 60 * 60

// getCoinsMarket does not paginate, so ids have to be split by the page size.
const IDS_PER_REQUEST = 250

// How the backend spells the gas token of a chain. Token represents it as an
// absent address.
const NATIVE_ADDRESS = 'native'

export interface MarketEntry {
  priceUsd: number
  marketCapUsd: number
}

export type Market = Record<string, MarketEntry>

export class TvlCache {
  private readonly cache = new InMemoryCache({})

  // One fetch covers every chain, so it is cached whole and sliced per chain.
  private allTokens(): Promise<BackendToken[]> {
    return this.cache.get(
      { key: ['tvl-tokens-backend'], ttl: TTL_SECONDS },
      () => fetchTokens(),
    )
  }

  getTokens(chainName: string): Promise<Token[]> {
    return this.cache.get(
      { key: ['tvl-tokens', chainName], ttl: TTL_SECONDS },
      async () => {
        const tokens = await this.allTokens()
        return tokens
          .filter((token) => token.chain === chainName)
          .map(
            (token): Token => ({
              symbol: token.symbol,
              coingeckoId: CoingeckoId(token.coingeckoId),
              decimals: token.decimals,
              iconUrl: token.iconUrl,
              address:
                token.address === NATIVE_ADDRESS
                  ? undefined
                  : ChainSpecificAddress.fromLong(chainName, token.address),
            }),
          )
      },
    )
  }

  // Keyed by chain only, so it must always be asked for every token of the
  // chain. A caller interested in a subset reads that subset out of the result.
  getMarket(provider: IProvider, tokens: Token[]): Promise<Market> {
    return this.cache.get(
      { key: ['tvl-market', provider.chain], ttl: TTL_SECONDS },
      () => fetchMarket(provider, tokens),
    )
  }
}

async function fetchMarket(
  provider: IProvider,
  tokens: Token[],
): Promise<Market> {
  const ids = unique(tokens.map((token) => token.coingeckoId))
  const chunks = toChunks(ids, IDS_PER_REQUEST)
  const responses = await Promise.all(
    chunks.map((chunk) => getCoinsMarket(provider, chunk)),
  )

  const market: Market = {}
  for (const entry of responses.flat()) {
    if (entry.current_price === null) continue
    market[entry.id] = {
      priceUsd: entry.current_price,
      // The response carries no market cap field, but the product of the two
      // fields it does carry is the same number.
      marketCapUsd: entry.current_price * (entry.circulating_supply ?? 0),
    }
  }
  return market
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
