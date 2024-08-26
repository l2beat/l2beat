import { safeGetTokenByAssetId } from '@l2beat/config'
import { type ProjectTvlBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { getExplorerUrlByChainId } from '~/utils/get-explorer-url'

export type ExtendedProjectTvlBreakdown = ReturnType<
  typeof assignTokenMetaToBreakdown
>

export function assignTokenMetaToBreakdown({
  dataTimestamp,
  breakdown: { native, canonical, external },
}: ProjectTvlBreakdown) {
  return {
    dataTimestamp,
    breakdown: {
      canonical,
      native: native.map((token) => {
        const fullTokenInfo = safeGetTokenByAssetId(token.assetId)
        return {
          ...token,
          iconUrl: fullTokenInfo!.iconUrl!,
          symbol: fullTokenInfo!.symbol,
          explorerUrl: getExplorerUrlByChainId(token.chainId)!,
          supply: fullTokenInfo!.supply,
        }
      }),
      external: external.map((token) => {
        const fullTokenInfo = safeGetTokenByAssetId(token.assetId)
        return {
          ...token,
          iconUrl: fullTokenInfo!.iconUrl!,
          symbol: fullTokenInfo!.symbol,
          explorerUrl: getExplorerUrlByChainId(token.chainId)!,
          supply: fullTokenInfo!.supply,
        }
      }),
    },
  }
}
