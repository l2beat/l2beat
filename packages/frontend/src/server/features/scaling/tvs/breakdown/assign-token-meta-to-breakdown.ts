import { safeGetTokenByAssetId } from '@l2beat/config'
import type { AssetId } from '@l2beat/shared-pure'
import type { SortedBreakdown } from './record-to-sorted-breakdown'

export function assignTokenMetaToBreakdown({
  canonical,
  native,
  external,
}: SortedBreakdown) {
  return {
    canonical: canonical.map(assignTokenMeta),
    native: native.map(assignTokenMeta),
    external: external.map(assignTokenMeta),
  }
}

function assignTokenMeta<T extends { assetId: AssetId }>(token: T) {
  const fullTokenInfo = safeGetTokenByAssetId(token.assetId)
  return {
    ...token,
    iconUrl: fullTokenInfo!.iconUrl!,
    symbol: fullTokenInfo!.symbol,
    name: fullTokenInfo!.name,
    url: fullTokenInfo?.url,
    supply: fullTokenInfo!.supply,
  }
}
