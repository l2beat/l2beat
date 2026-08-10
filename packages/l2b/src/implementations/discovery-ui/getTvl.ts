import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { calculateValue, getBalances } from '../estimateTVL'
import type { ProviderCache } from './ProviderCache'
import type { TvlCache } from './TvlCache'
import type { ApiTvlResponse } from './types'

const USD_CENTS_IN_DOLLAR = 100

export async function getTvl(
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  holder: ChainSpecificAddress,
): Promise<ApiTvlResponse> {
  const chainName = ChainSpecificAddress.longChain(holder)
  const provider = await providerCache.get(chainName)

  const tokens = await tvlCache.getTokens(chainName)
  const market = await tvlCache.getMarket(provider, tokens)
  const balances = await getBalances(provider, holder, tokens)

  return balances
    .map((balance) => {
      const price = market[balance.coingeckoId.toString()]?.priceUsd
      const value = price
        ? calculateValue(balance.balance, price, balance.decimals)
        : 0n
      return {
        tvl: Number(value) / USD_CENTS_IN_DOLLAR,
        ticker: balance.symbol,
        iconURL: balance.iconUrl,
        balance: toTokenAmount(balance.balance, balance.decimals),
        price,
      }
    })
    .sort((a, b) => b.tvl - a.tvl)
}

function toTokenAmount(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}
