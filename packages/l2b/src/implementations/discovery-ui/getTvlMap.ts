import type { ConfigReader, TemplateService } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
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
  ApiTvlMapProgress,
  ApiTvlMapResponse,
} from './types'

const USD_CENTS_IN_DOLLAR = 100

// A full sweep is ~3k tokens on ethereum. Cutting it to the largest ones by
// market cap trades a known slice of the value for a proportionally shorter
// sweep: everything below the cut holds under 1% of all market cap.
const TOKENS_PER_CHAIN = 500

// How many tokens a single tile names.
const TOKENS_PER_ENTRY = 3

// What is sent to these is gone, so their balance is not value a project holds.
// They also have to leave for the map to be readable at all: tokens are burned
// in amounts their price was never meant to be multiplied by, which puts one
// tile several orders of magnitude above every real holder.
const BURNED = [
  EthereumAddress.ZERO,
  EthereumAddress('0x000000000000000000000000000000000000dEaD'),
]

// Asking for every holder at once reports no progress at all: the provider
// coalesces one tick's calls into a single set and resolves the whole set
// together, so all holders would finish in the same millisecond. Holders are
// swept in groups of roughly this many calls instead, which costs a drain of
// the batch pipeline per group and buys a progress step per group.
const CALLS_PER_GROUP = 6000

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
  onProgress: (progress: ApiTvlMapProgress) => void,
): Promise<ApiTvlMapResponse> {
  const holders = collectHolders(
    getProject(configReader, templateService, project),
  )
  const holdersPerChain = groupByChain(holders)

  // The count lives here rather than in the per-chain sweeps, so that chains
  // running in parallel report one number instead of one each.
  let done = 0
  const total = holders.length
  onProgress({ done, total })
  const onHoldersDone = (count: number) => {
    done += count
    onProgress({ done, total })
  }

  const entriesPerChain = await Promise.all(
    [...holdersPerChain].map(([chain, chainHolders]) =>
      getChainEntries(
        providerCache,
        tvlCache,
        chain,
        chainHolders,
        onHoldersDone,
      ),
    ),
  )

  return {
    addressCount: holders.length,
    tokensPerChain: TOKENS_PER_CHAIN,
    entries: entriesPerChain.flat().sort((a, b) => b.tvl - a.tvl),
  }
}

async function getChainEntries(
  providerCache: ProviderCache,
  tvlCache: TvlCache,
  chain: string,
  holders: Holder[],
  onHoldersDone: (count: number) => void,
): Promise<ApiTvlMapEntry[]> {
  const provider = await providerCache.get(chain)
  const tokens = await tvlCache.getTokens(chain)
  const market = await tvlCache.getMarket(provider, tokens)
  const swept = topByMarketCap(tokens, market, TOKENS_PER_CHAIN)

  const entries: ApiTvlMapEntry[] = []
  // Holders within a group still coalesce into as few multicalls as they can.
  const groupSize = Math.max(1, Math.floor(CALLS_PER_GROUP / swept.length))
  for (const group of toGroups(holders, groupSize)) {
    const groupEntries = await Promise.all(
      group.map(async (holder) =>
        toEntry(
          holder,
          chain,
          await getBalances(provider, holder.address, swept),
          market,
        ),
      ),
    )
    entries.push(...groupEntries)
    onHoldersDone(group.length)
  }

  return entries.filter((entry) => entry.tvl > 0)
}

function toGroups(holders: Holder[], groupSize: number): Holder[][] {
  assert(groupSize > 0, 'A group has to fit at least one holder')
  const groups: Holder[][] = []
  for (let index = 0; index < holders.length; index += groupSize) {
    groups.push(holders.slice(index, index + groupSize))
  }
  return groups
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
  return project.entries
    .flatMap((chain) => [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ])
    .filter((entry) => !isBurned(entry.address))
    .map(
      (entry): Holder => ({
        address: entry.address,
        name: entry.name,
        type: entry.type,
      }),
    )
}

function isBurned(address: ChainSpecificAddress): boolean {
  return BURNED.includes(ChainSpecificAddress.address(address))
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
