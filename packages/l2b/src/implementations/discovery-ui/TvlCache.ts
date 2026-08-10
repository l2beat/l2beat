import type { IProvider } from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  CoingeckoId,
  InMemoryCache,
  toBatches,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { calculateValue, type Token, type TokenBalance } from '../estimateTVL'
import { type BackendToken, fetchTokens } from './tokenBackend'

const TTL_SECONDS = 60 * 60

// getCoinsMarket does not paginate, so ids have to be split by the page size.
const IDS_PER_REQUEST = 250

// How the backend spells the gas token of a chain. Token represents it as an
// absent address.
const NATIVE_ADDRESS = 'native'

const USD_CENTS_IN_DOLLAR = 100

export interface MarketEntry {
  priceUsd: number
  marketCapUsd: number
}

export type Market = Record<string, MarketEntry>

export interface ChainMarket {
  tokens: Token[]
  market: Market
}

export class TvlCache {
  private readonly cache = new InMemoryCache({})

  // Tokens and market come out together because one belongs to the other: the
  // market is fetched for every token of the chain and cached under the chain
  // alone, so it cannot be asked for a narrower set than it holds.
  async getChainMarket(provider: IProvider): Promise<ChainMarket> {
    const tokens = await this.getTokens(provider.chain)
    const market = await this.getMarket(provider, tokens)
    return { tokens, market }
  }

  // One fetch covers every chain, so it is cached whole and sliced per chain.
  private allTokens(): Promise<BackendToken[]> {
    return this.cache.get(
      { key: ['tvl-tokens-backend'], ttl: TTL_SECONDS },
      () => fetchTokens(),
    )
  }

  private getTokens(chainName: string): Promise<Token[]> {
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

  private getMarket(provider: IProvider, tokens: Token[]): Promise<Market> {
    return this.cache.get(
      { key: ['tvl-market', provider.chain], ttl: TTL_SECONDS },
      () => fetchMarket(provider, tokens),
    )
  }
}

// Worth what the market says, or nothing at all when it quotes no price.
export function toUsdValue(balance: TokenBalance, market: Market): number {
  const price = market[balance.coingeckoId.toString()]?.priceUsd
  if (price === undefined) {
    return 0
  }
  const cents = calculateValue(balance.balance, price, balance.decimals)
  return Number(cents) / USD_CENTS_IN_DOLLAR
}

async function fetchMarket(
  provider: IProvider,
  tokens: Token[],
): Promise<Market> {
  const ids = unique(tokens.map((token) => token.coingeckoId))
  const requests = toBatches(ids, IDS_PER_REQUEST)
  const responses = await Promise.all(
    requests.map((request) => getCoinsMarket(provider, request)),
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
