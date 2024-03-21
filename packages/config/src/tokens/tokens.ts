/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

You can check the detailed steps on how to add new tokens in the tvl.md file in the repository.
*/

import { AssetId, Token, UnixTime } from '@l2beat/shared-pure'

import { tokens } from './generated.json'
import { GeneratedToken } from './types'

export const tokenList: Token[] = tokens
  .map((t) => GeneratedToken.parse(t))
  .map(toToken)

export const canonicalTokenList: Token[] = tokenList.filter(
  (t) => t.type === 'CBV',
)

const canonicalTokenMap = new Map(
  canonicalTokenList.map((t) => [t.symbol, t] as const),
)

export function getCanonicalTokenBySymbol(symbol: string) {
  const token = canonicalTokenMap.get(symbol)
  if (!token) {
    throw new TypeError(`Unknown token ${symbol}`)
  }
  return token
}

const tokenMapByAssetId = new Map(tokenList.map((t) => [t.id, t] as const))

export function safeGetTokenByAssetId(assetId: AssetId) {
  return tokenMapByAssetId.get(assetId)
}

export function getTokenByAssetId(assetId: AssetId) {
  const token = tokenMapByAssetId.get(assetId)
  if (!token) {
    throw new TypeError(`Unknown token ${assetId.toString()}`)
  }
  return token
}

function toToken(generated: GeneratedToken): Token {
  const sinceTimestamp = new UnixTime(
    Math.max(
      generated.deploymentTimestamp.toNumber(),
      generated.coingeckoListingTimestamp.toNumber(),
    ),
  )

  return {
    ...generated,
    sinceTimestamp,
  }
}
