import {
  type AssetId,
  type CanonicalAssetBreakdownData,
  type ChainId,
} from '@l2beat/shared-pure'

export interface CanonicalAssetBreakdown {
  assetId: AssetId
  chainId: ChainId
  amount: number
  usdValue: number
  usdPrice: string
  escrows: CanonicalAssetBreakdownData['escrows']
}
