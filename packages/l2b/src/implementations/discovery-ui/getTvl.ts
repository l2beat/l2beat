import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { getBalances, type Token } from '../estimateTVL'
import type { ProviderCache } from './ProviderCache'
import { type Market, type TvlCache, toUsdValue } from './TvlCache'
import type { ApiTvlResponse } from './types'

// `top` bounds the sweep to that many tokens, largest market cap first. A chain
// has ~3k tokens and the ones below the cut hold under 1% of all market cap, so
// a caller valuing many addresses can trade that tail for a shorter sweep.
export async function getTvl(
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  holder: ChainSpecificAddress,
  top: number | undefined,
): Promise<ApiTvlResponse> {
  const chainName = ChainSpecificAddress.longChain(holder)
  const provider = await providerCache.get(chainName)

  const { tokens, market } = await tvlCache.getChainMarket(provider)
  const swept = top === undefined ? tokens : topByMarketCap(tokens, market, top)
  const balances = await getBalances(provider, holder, swept)

  return balances
    .map((balance) => ({
      tvl: toUsdValue(balance, market),
      ticker: balance.symbol,
      address: balance.address?.toString() ?? 'native',
      iconURL: balance.iconUrl,
      balance: toTokenAmount(balance.balance, balance.decimals),
      price: market[balance.coingeckoId.toString()]?.priceUsd,
    }))
    .sort((a, b) => b.tvl - a.tvl)
}

function topByMarketCap(
  tokens: Token[],
  market: Market,
  limit: number,
): Token[] {
  return tokens
    .map((token) => ({
      token,
      marketCapUsd: market[token.coingeckoId.toString()]?.marketCapUsd ?? 0,
    }))
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
    .slice(0, limit)
    .map((entry) => entry.token)
}

function toTokenAmount(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}
