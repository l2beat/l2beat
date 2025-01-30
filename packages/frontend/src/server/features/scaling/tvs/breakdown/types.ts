import type {
  AssetId,
  ChainId,
  EthereumAddress,
  TokenBridgedUsing,
} from '@l2beat/shared-pure'

type BaseAssetBreakdownData = {
  assetId: AssetId
  chainId: ChainId
  amount: number
  usdValue: number
  usdPrice: string
  tokenAddress?: EthereumAddress
}

export type CanonicalAssetBreakdownData = BaseAssetBreakdownData & {
  escrows: {
    amount: number
    usdValue: number
    escrowAddress: EthereumAddress
    isPreminted?: boolean
    isSharedEscrow?: boolean
  }[]
}

export type ExternalAssetBreakdownData = BaseAssetBreakdownData & {
  bridgedUsing: TokenBridgedUsing
}

export type NativeAssetBreakdownData = BaseAssetBreakdownData

export type BreakdownRecord = {
  canonical: Map<AssetId, CanonicalAssetBreakdownData>
  external: ExternalAssetBreakdownData[]
  native: NativeAssetBreakdownData[]
}
