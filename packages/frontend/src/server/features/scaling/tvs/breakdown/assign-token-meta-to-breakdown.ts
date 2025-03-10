import type { AssetId, Token } from '@l2beat/shared-pure'
import type { SortedBreakdown } from './record-to-sorted-breakdown'

export function assignTokenMetaToBreakdown(
  { canonical, native, external }: SortedBreakdown,
  tokenMap: Map<AssetId, Token>,
) {
  return {
    canonical: canonical.map((t) => assignTokenMeta(t, tokenMap)),
    native: native.map((t) => assignTokenMeta(t, tokenMap)),
    external: external.map((t) => assignTokenMeta(t, tokenMap)),
  }
}

function assignTokenMeta<T extends { assetId: AssetId }>(
  token: T,
  tokenMap: Map<AssetId, Token>,
) {
  const fullTokenInfo = tokenMap.get(token.assetId)
  return {
    ...token,
    iconUrl: fullTokenInfo!.iconUrl!,
    symbol: fullTokenInfo!.symbol,
    name: fullTokenInfo!.name,
    url: fullTokenInfo?.url,
    supply: fullTokenInfo!.supply,
  }
}
