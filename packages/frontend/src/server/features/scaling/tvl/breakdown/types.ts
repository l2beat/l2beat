import {
  type AssetId,
  type ChainId,
  type EthereumAddress,
  type TokenBridgedUsing,
} from '@l2beat/shared-pure'

type BaseAssetBreakdownData = {
  assetId: AssetId
  chainId: ChainId
  amount: number
  usdValue: number
  usdPrice: string
}

export type CanonicalAssetBreakdownData = BaseAssetBreakdownData & {
  escrows: {
    amount: number
    usdValue: number
    escrowAddress: EthereumAddress
    isPreminted?: boolean
    warning?: string
  }[]
}

export type ExternalAssetBreakdownData = BaseAssetBreakdownData & {
  tokenAddress?: EthereumAddress
  bridgedUsing: TokenBridgedUsing
}

export type NativeAssetBreakdownData = BaseAssetBreakdownData & {
  tokenAddress?: EthereumAddress
}

export type BreakdownRecord = {
  canonical: Map<AssetId, CanonicalAssetBreakdownData>
  external: ExternalAssetBreakdownData[]
  native: NativeAssetBreakdownData[]
}
