import { INTEROP_CHAINS } from '@l2beat/config'
import type { TokenDatabase } from '@l2beat/database'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  buildAliasToChainMap,
  findUnregisteredPlatformTokens,
  platformsToChainAddressPairs,
} from './chainAliases'

const INTEROP_CHAIN_IDS = new Set(INTEROP_CHAINS.map((chain) => chain.id))

export async function getSuggestionsByCoingeckoId(
  coingeckoClient: CoingeckoClient,
  tokenDb: TokenDatabase,
  coingeckoId: string,
) {
  const coin = await coingeckoClient.getCoinDataById(coingeckoId)
  if (!coin) return []

  const chains = await tokenDb.chain.getAll()
  const aliasToChain = buildAliasToChainMap(chains)
  const chainAddressPairs = platformsToChainAddressPairs(
    coin.platforms,
    aliasToChain,
  )

  const deployedTokens =
    await tokenDb.deployedToken.getByChainsAndAddresses(chainAddressPairs)

  return findUnregisteredPlatformTokens(
    coin.platforms,
    deployedTokens,
    aliasToChain,
  ).map((suggestion) => ({
    ...suggestion,
    isInterop: INTEROP_CHAIN_IDS.has(suggestion.chain),
  }))
}
