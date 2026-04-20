import { INTEROP_CHAINS } from '@l2beat/config'
import type { AbstractTokenRecord, TokenDatabase } from '@l2beat/database'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  buildAliasToChainMap,
  platformsToChainAddressPairs,
} from './chainAliases'

export interface CoingeckoSuggestionResult {
  abstractToken: Pick<
    AbstractTokenRecord,
    'id' | 'symbol' | 'issuer' | 'coingeckoId'
  >
  suggestions: {
    chain: string
    address: string
  }[]
}

export interface CoingeckoSuggestionsReport {
  generatedAt: string
  totals: {
    abstractTokens: number
    abstractTokensWithCoingeckoId: number
    abstractTokensWithSuggestions: number
    totalSuggestions: number
    errors: number
  }
  results: CoingeckoSuggestionResult[]
  errors: {
    abstractTokenId: string
    coingeckoId: string
    error: string
  }[]
}

const INTEROP_CHAIN_IDS = new Set(INTEROP_CHAINS.map((chain) => chain.id))

export async function getCoingeckoSuggestions(
  coingeckoClient: CoingeckoClient,
  tokenDb: TokenDatabase,
  options: {
    interopOnly: boolean
  },
): Promise<CoingeckoSuggestionsReport> {
  const [abstractTokens, deployedTokens, chains, coins] = await Promise.all([
    tokenDb.abstractToken.getAll(),
    tokenDb.deployedToken.getAll(),
    tokenDb.chain.getAll(),
    coingeckoClient.getCoinList({ includePlatform: true }),
  ])

  const abstractTokensWithCoingeckoId = abstractTokens
    .filter((token) => token.coingeckoId)
    .sort((a, b) => a.id.localeCompare(b.id))
  const deployedTokensSet = new Set(
    deployedTokens.map(
      (token) => `${token.chain}:${token.address.toLowerCase()}`,
    ),
  )
  const aliasToChain = buildAliasToChainMap(chains)
  const coinsById = new Map(coins.map((coin) => [coin.id, coin]))

  const results: CoingeckoSuggestionResult[] = []
  const errors: CoingeckoSuggestionsReport['errors'] = []
  let abstractTokensWithSuggestions = 0
  let totalSuggestions = 0

  for (const abstractToken of abstractTokensWithCoingeckoId) {
    const coingeckoId = abstractToken.coingeckoId
    if (!coingeckoId) {
      continue
    }

    try {
      const platforms: Record<string, string | null | undefined> | undefined =
        coinsById.get(coingeckoId)?.platforms

      if (!platforms) {
        throw new Error('Coin not found in CoinGecko /coins/list response')
      }

      const suggestions = getSuggestionsForCoin(
        platforms,
        aliasToChain,
        deployedTokensSet,
      )
      const filteredSuggestions = options.interopOnly
        ? suggestions.filter((suggestion) =>
            INTEROP_CHAIN_IDS.has(suggestion.chain),
          )
        : suggestions

      if (filteredSuggestions.length > 0) {
        abstractTokensWithSuggestions += 1
        totalSuggestions += filteredSuggestions.length
        results.push(toSuggestionResult(abstractToken, filteredSuggestions))
      }
    } catch (error) {
      errors.push({
        abstractTokenId: abstractToken.id,
        coingeckoId,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      abstractTokens: abstractTokens.length,
      abstractTokensWithCoingeckoId: abstractTokensWithCoingeckoId.length,
      abstractTokensWithSuggestions,
      totalSuggestions,
      errors: errors.length,
    },
    results,
    errors,
  }
}

export function toCoingeckoSuggestionsQueueCsv(
  results: CoingeckoSuggestionResult[],
) {
  return results
    .flatMap((result) =>
      result.suggestions.map(
        (suggestion) =>
          `${suggestion.chain},${suggestion.address},${result.abstractToken.id}`,
      ),
    )
    .join('\n')
}

function toSuggestionResult(
  abstractToken: AbstractTokenRecord,
  suggestions: { chain: string; address: string }[],
): CoingeckoSuggestionResult {
  return {
    abstractToken: {
      id: abstractToken.id,
      symbol: abstractToken.symbol,
      issuer: abstractToken.issuer,
      coingeckoId: abstractToken.coingeckoId,
    },
    suggestions: [...suggestions].sort(
      (a, b) =>
        a.chain.localeCompare(b.chain) || a.address.localeCompare(b.address),
    ),
  }
}

function getSuggestionsForCoin(
  platforms: Record<string, string | null | undefined>,
  aliasToChain: Map<string, string>,
  deployedTokensSet: Set<string>,
) {
  return platformsToChainAddressPairs(platforms, aliasToChain).filter(
    ({ chain, address }) =>
      !deployedTokensSet.has(`${chain}:${address.toLowerCase()}`),
  )
}
