import { getChainConfig, type IProvider } from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { getBalances, type Token } from '../estimateTVL'
import { selectHeldTokens, toTokenAddresses } from './heldTokens'
import type { ProviderCache } from './ProviderCache'
import { type Market, type TvlCache, toUsdValue } from './TvlCache'
import type { ApiTvlResponse } from './types'

export async function getTvl(
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  holder: ChainSpecificAddress,
  top: number | undefined,
): Promise<ApiTvlResponse> {
  const chainName = ChainSpecificAddress.longChain(holder)
  const tvls = await getTvls(providerCache, tvlCache, chainName, [holder], top)
  assert(tvls.length === 1, 'One holder gets one answer')
  return tvls[0] as ApiTvlResponse
}

// Values many holders of one chain together, in the order given, because the
// holder index answers for a list of holders at the cost of one.
//
// `top` bounds the sweep to that many tokens, largest market cap first. A chain
// has ~3k tokens and the ones below the cut hold under 1% of all market cap, so
// a caller valuing many addresses can trade that tail for a shorter sweep.
//
// Where the RPC of the chain indexes what a holder ever held, only those
// tokens are swept. That is short already and drops no value, so `top` is left
// unused there.
export async function getTvls(
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  chainName: string,
  holders: ChainSpecificAddress[],
  top: number | undefined,
): Promise<ApiTvlResponse[]> {
  const provider = await providerCache.get(chainName)
  const multicall = getChainConfig(chainName).multicall?.address
  const multicallAddress =
    multicall === undefined
      ? undefined
      : ChainSpecificAddress.fromLong(chainName, multicall)

  const { tokens, market } = await tvlCache.getChainMarket(provider)
  const held = await provider.getHeldTokens(holders, toTokenAddresses(tokens))
  if (held.includes(undefined)) {
    console.warn('Holder index unavailable, sweeping every token', {
      chain: chainName,
    })
  }
  const sweptWithoutIndex =
    top === undefined ? tokens : topByMarketCap(tokens, market, top)

  return await Promise.all(
    holders.map((holder, index) => {
      const heldByHolder = held[index]
      const swept =
        heldByHolder === undefined
          ? sweptWithoutIndex
          : selectHeldTokens(tokens, heldByHolder)
      return getTvlOfTokens(provider, market, holder, swept, multicallAddress)
    }),
  )
}

async function getTvlOfTokens(
  provider: IProvider,
  market: Market,
  holder: ChainSpecificAddress,
  tokens: Token[],
  multicall: ChainSpecificAddress | undefined,
): Promise<ApiTvlResponse> {
  const balances = await getBalances(provider, holder, tokens, multicall)

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
