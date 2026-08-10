import type { ConfigReader, TemplateService } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  calculateValue,
  getBalances,
  type Token,
  type TokenBalance,
} from '../estimateTVL'
import { getProject } from './getProject'
import type { ProviderCache } from './ProviderCache'
import type { Market, TvlCache } from './TvlCache'
import type {
  ApiAddressType,
  ApiProjectResponse,
  ApiTvlMapEntry,
  ApiTvlMapResponse,
} from './types'

const USD_CENTS_IN_DOLLAR = 100

// A full sweep is ~3k tokens on ethereum. Cutting it to the largest ones by
// market cap trades a known slice of the value for a proportionally shorter
// sweep: everything below the cut holds under 1% of all market cap.
const TOKENS_PER_CHAIN = 500

// How many tokens a single tile names.
const TOKENS_PER_ENTRY = 3

interface Holder {
  address: ChainSpecificAddress
  name: string | undefined
  type: ApiAddressType
}

export async function getTvlMap(
  configReader: ConfigReader,
  templateService: TemplateService,
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  project: string,
): Promise<ApiTvlMapResponse> {
  const holders = collectHolders(
    getProject(configReader, templateService, project),
  )
  const holdersPerChain = groupByChain(holders)

  const entriesPerChain = await Promise.all(
    [...holdersPerChain].map(([chain, chainHolders]) =>
      getChainEntries(providerCache, tvlCache, chain, chainHolders),
    ),
  )

  return {
    addressCount: holders.length,
    tokensPerChain: TOKENS_PER_CHAIN,
    entries: entriesPerChain.flat().sort((a, b) => b.tvl - a.tvl),
  }
}

// Every holder of a chain is queried in one go, because the provider coalesces
// whatever is asked for within a tick into as few multicalls as it can.
async function getChainEntries(
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  chain: string,
  holders: Holder[],
): Promise<ApiTvlMapEntry[]> {
  const provider = await providerCache.get(chain)
  const tokens = await tvlCache.getTokens(chain)
  const market = await tvlCache.getMarket(provider, tokens)
  const swept = topByMarketCap(tokens, market, TOKENS_PER_CHAIN)

  const entries = await Promise.all(
    holders.map(async (holder) =>
      toEntry(
        holder,
        chain,
        await getBalances(provider, holder.address, swept),
        market,
      ),
    ),
  )
  return entries.filter((entry) => entry.tvl > 0)
}

function toEntry(
  holder: Holder,
  chain: string,
  balances: TokenBalance[],
  market: Market,
): ApiTvlMapEntry {
  const tokens = balances
    .map((balance) => {
      const price = market[balance.coingeckoId.toString()]?.priceUsd
      const value = price
        ? calculateValue(balance.balance, price, balance.decimals)
        : 0n
      return {
        ticker: balance.symbol,
        tvl: Number(value) / USD_CENTS_IN_DOLLAR,
      }
    })
    .sort((a, b) => b.tvl - a.tvl)

  return {
    address: holder.address.toString(),
    name: holder.name,
    type: holder.type,
    chain,
    tvl: tokens.reduce((sum, token) => sum + token.tvl, 0),
    tokens: tokens.slice(0, TOKENS_PER_ENTRY),
  }
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

function collectHolders(project: ApiProjectResponse): Holder[] {
  return project.entries.flatMap((chain) =>
    [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ].map(
      (entry): Holder => ({
        address: entry.address,
        name: entry.name,
        type: entry.type,
      }),
    ),
  )
}

function groupByChain(holders: Holder[]): Map<string, Holder[]> {
  const grouped = new Map<string, Holder[]>()
  for (const holder of holders) {
    const chain = ChainSpecificAddress.longChain(holder.address)
    const existing = grouped.get(chain)
    if (existing === undefined) {
      grouped.set(chain, [holder])
    } else {
      existing.push(holder)
    }
  }
  return grouped
}
