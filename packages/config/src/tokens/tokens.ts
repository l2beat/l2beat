/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

You can check the detailed steps on how to add new tokens in the tvl.md file in the repository.
*/

import { AssetId, Token } from '@l2beat/shared-pure'

export const tokenList: Token[] = []

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
