/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

You can check the detailed steps on how to add new tokens in the tvl.md file in the repository.
*/

import { assert, AssetId, type Token, UnixTime } from '@l2beat/shared-pure'

import { chains } from '../projects/chains'
import generated from './generated.json'
import { GeneratedToken } from './types'

export const tokenList: Token[] = generated.tokens
  .map((t) => GeneratedToken.parse(t))
  .map(toToken)

const tokenMapByAssetId = new Map(tokenList.map((t) => [t.id, t] as const))

export function safeGetTokenByAssetId(assetId: AssetId) {
  return tokenMapByAssetId.get(assetId)
}

function toToken(generated: GeneratedToken): Token {
  const chain = chains.find((c) => c.chainId === +generated.chainId)
  assert(chain, `Chain nor found for ${generated.symbol}`)
  assert(
    chain.minTimestampForTvl,
    `Token added for chain without minTimestampForTvl ${chain.name}`,
  )

  const sinceTimestamp = new UnixTime(
    Math.max(
      generated.deploymentTimestamp.toNumber(),
      chain.minTimestampForTvl.toNumber(),
      generated.coingeckoListingTimestamp.toNumber(),
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
