import type { TokenDatabase } from '@l2beat/database'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  buildAliasToChainMap,
  findUnregisteredPlatformTokens,
  platformsToChainAddressPairs,
} from './chainAliases'

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
  )
}
