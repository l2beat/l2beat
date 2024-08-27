import { safeGetTokenByAssetId } from '@l2beat/config'
import { type AssetId, type ChainId } from '@l2beat/shared-pure'
import { type ProjectTvlBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { getExplorerUrlByChainId } from '~/utils/get-explorer-url'

export type ExtendedProjectTvlBreakdown = ReturnType<
  typeof assignTokenMetaToBreakdown
>

// TODO: Maybe should be part of get-tvl-breakdown-for-project out of the box
// so we do not need ExtendedProjectTvlBreakdown type
export function assignTokenMetaToBreakdown({
  dataTimestamp,
  breakdown: { native, canonical, external },
}: ProjectTvlBreakdown) {
  return {
    dataTimestamp,
    breakdown: {
      canonical: canonical.map(assignTokenMeta),
      native: native.map(assignTokenMeta),
      external: external.map(assignTokenMeta),
    },
  }
}

function assignTokenMeta<T extends { assetId: AssetId; chainId: ChainId }>(
  token: T,
) {
  const fullTokenInfo = safeGetTokenByAssetId(token.assetId)
  return {
    ...token,
    iconUrl: fullTokenInfo!.iconUrl!,
    symbol: fullTokenInfo!.symbol,
    explorerUrl: getExplorerUrlByChainId(token.chainId)!,
    supply: fullTokenInfo!.supply,
  }
}
