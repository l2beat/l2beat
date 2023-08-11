/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

Because of this we will enforce the following requirements for adding a token to
this list:

1. The token MUST be locked inside one of the layer2s found in `./layer2s` as
   reported by etherscan.io
2. The token MUST satisfy at least one of the following:
  2.1. The token is associated with the layer2 and added to `associatedTokens`
  2.2. The token is in the top 300 of coins as reported by coingecko.com
3. The token SHOULD be listed on Uniswap V2 or V3 with sufficient liquidity. If
   this is not satisfied getting the token price will be problematic. In the
   future more exchanges will be supported, e.g. SushiSwap.

Please also note that for the time being we (incorrectly) treat the token symbol
as the identifier. If your token symbol clashes with one of the existing tokens
you are out of luck. We will fix this in the future.

*/

/*

                         === How to add new token ===
                        Please read before adding tokens

1. Find the token Ethereum address
2. Run the script `yarn tokens:add <address> <category>`
3. Commit the changes and open a PR

*/

import { AssetId, Token } from '@l2beat/shared-pure'

import { layer2s } from '../layer2s'
import { getCanonicalTokens } from './types'

const canonicalTokenList: Token[] = getCanonicalTokens()

export const tokenList: Token[] = canonicalTokenList
  .concat(layer2s.map((l2) => l2.config.tokenList ?? []).flat())
  .sort((a, b) => a.name.localeCompare(b.name))

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
