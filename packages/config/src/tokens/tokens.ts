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

import { AssetId, CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared'

import { tokens } from './tokenList.json'

export interface TokenInfo {
  /** Internal token id. Usually ticker-name */
  id: AssetId
  /** Token name as dictated by the token contract */
  name: string
  /** Token symbol as dictated by the token contract */
  symbol: string
  /** Token address. Only Ether has no address */
  address?: EthereumAddress
  /** Token Coingecko API id. Used to fetch prices */
  coingeckoId: CoingeckoId
  /** Token decimals as dictated by the token contract */
  decimals: number
  /** Timestamp of the token contract deployment transaction */
  sinceTimestamp: UnixTime
  /** Which category does the token belong to */
  category: 'ether' | 'stablecoin' | 'other'
}

export const tokenList: TokenInfo[] = tokens.map((t) => ({
  id: AssetId(t.id),
  name: t.name,
  symbol: t.symbol,
  address: t.address ? EthereumAddress(t.address) : undefined,
  coingeckoId: CoingeckoId(t.coingeckoId),
  decimals: t.decimals,
  sinceTimestamp: new UnixTime(t.sinceTimestamp),
  category: t.category as 'ether' | 'stablecoin' | 'other',
}))

const tokenMap = new Map(tokenList.map((t) => [t.symbol, t] as const))

export function getTokenBySymbol(symbol: string) {
  const token = tokenMap.get(symbol)
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

const tokenMapByCoingeckoId = new Map(
  tokenList.map((t) => [t.coingeckoId, t] as const),
)

export function getTokenByCoingeckoId(coingeckoId: CoingeckoId) {
  const token = tokenMapByCoingeckoId.get(coingeckoId)
  if (!token) {
    throw new TypeError(`Unknown token ${coingeckoId.toString()}`)
  }
  return token
}
