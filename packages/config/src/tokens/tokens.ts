/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

You can check the detailed steps on how to add new tokens in the tvl.md file in the repository.
*/

import { assert, AssetId, type Token, UnixTime } from '@l2beat/shared-pure'

import type { ChainConfig } from '../types'
import generated from './generated.json'
import { GeneratedToken } from './types'

export function getTokenList(chains: ChainConfig[]): Token[] {
  return generated.tokens.map((t) => toToken(GeneratedToken.parse(t), chains))
}

function toToken(generated: GeneratedToken, chains: ChainConfig[]): Token {
  const chain = chains.find((c) => c.chainId === +generated.chainId)
  assert(chain, `Chain nor found for ${generated.symbol}`)
  assert(
    chain.sinceTimestamp,
    `Token added for chain without sinceTimestamp ${chain.name}`,
  )

  const sinceTimestamp = UnixTime(
    Math.max(
      generated.deploymentTimestamp,
      chain.sinceTimestamp,
      generated.coingeckoListingTimestamp,
    ),
  )

  return {
    id: AssetId.create(chain.name, generated.address),
    ...generated,
    chainName: chain.name,
    url:
      generated.address && chain.explorerUrl
        ? `${chain.explorerUrl}/address/${generated.address}`
        : undefined,
    sinceTimestamp,
  }
}
