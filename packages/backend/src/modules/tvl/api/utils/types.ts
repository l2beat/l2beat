import {
  AssetId,
  CanonicalAssetBreakdownData,
  ChainId,
} from '@l2beat/shared-pure'

export interface CanonicalAssetBreakdown {
  assetId: AssetId
  chainId: ChainId
  amount: number
  usdValue: number
  usdPrice: string
  escrows: CanonicalAssetBreakdownData['escrows']
}
