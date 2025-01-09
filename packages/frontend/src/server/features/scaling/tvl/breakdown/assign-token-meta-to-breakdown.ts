import { safeGetTokenByAssetId } from '@l2beat/config'
import { type AssetId, type ChainId } from '@l2beat/shared-pure'
import { getExplorerUrlByChainId } from '~/utils/get-explorer-url'
import { type SortedBreakdown } from './record-to-sorted-breakdown'

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

function assignTokenMeta<T extends { assetId: AssetId; chainId: ChainId }>(
  token: T,
) {
  const fullTokenInfo = safeGetTokenByAssetId(token.assetId)
  if (fullTokenInfo?.symbol === 'HOP') {
    console.log(token, fullTokenInfo)
  }
  return {
    ...token,
    iconUrl: fullTokenInfo!.iconUrl!,
    symbol: fullTokenInfo!.symbol,
    explorerUrl: getExplorerUrlByChainId(token.chainId)!,
    supply: fullTokenInfo!.supply,
  }
}
