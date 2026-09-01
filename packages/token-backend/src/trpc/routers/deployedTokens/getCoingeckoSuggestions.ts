import { INTEROP_CHAINS } from '@l2beat/config'
import type { AbstractTokenRecord, TokenDatabase } from '@l2beat/database'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  buildAliasToChainMap,
  platformsToChainAddressPairs,
} from './chainAliases'

const INTEROP_CHAIN_IDS = new Set(INTEROP_CHAINS.map((chain) => chain.id))

export type CoingeckoSuggestion = {
  chain: string
  address: string
  explorerUrl: string | undefined
  abstractToken: AbstractTokenRecord
  isInterop: boolean
}

export async function getCoingeckoSuggestions(
  coingeckoClient: CoingeckoClient,
  tokenDb: TokenDatabase,
): Promise<CoingeckoSuggestion[]> {
  const [abstractTokens, deployedTokens, chains, coins] = await Promise.all([
    tokenDb.abstractToken.getAll(),
    tokenDb.deployedToken.getAll(),
    tokenDb.chain.getAll(),
    coingeckoClient.getCoinList({ includePlatform: true }),
  ])

  const deployedTokenSet = new Set(
    deployedTokens.map((t) => `${t.chain}:${t.address.toLowerCase()}`),
  )
  const aliasToChain = buildAliasToChainMap(chains)
  const coinsById = new Map(coins.map((coin) => [coin.id, coin]))
  const chainMap = new Map(chains.map((c) => [c.name, c]))

  const suggestions: CoingeckoSuggestion[] = []
  for (const abstractToken of abstractTokens) {
    if (!abstractToken.coingeckoId) continue
    const coin = coinsById.get(abstractToken.coingeckoId)
    if (!coin?.platforms) continue

    const pairs = platformsToChainAddressPairs(coin.platforms, aliasToChain)
    for (const pair of pairs) {
      if (deployedTokenSet.has(`${pair.chain}:${pair.address.toLowerCase()}`)) {
        continue
      }
      suggestions.push({
        chain: pair.chain,
        address: pair.address,
        explorerUrl: chainMap.get(pair.chain)?.explorerUrl ?? undefined,
        abstractToken,
        isInterop: INTEROP_CHAIN_IDS.has(pair.chain),
      })
    }
  }

  return suggestions
}
