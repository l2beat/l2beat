import type {
  AssetId,
  ChainId,
  EthereumAddress,
  TokenBridgedUsing,
} from '@l2beat/shared-pure'

export type BaseAssetBreakdownData = {
  assetId: AssetId
  chain: {
    id: ChainId
    name: string
  }
  amount: number
  usdValue: number
  usdPrice: string
  tokenAddress?: EthereumAddress
  isGasToken?: boolean
}

export type CanonicalAssetBreakdownData = BaseAssetBreakdownData & {
  escrows: {
    amount: number
    usdValue: number
    escrowAddress: EthereumAddress
    isPreminted?: boolean
    isSharedEscrow?: boolean
    url?: string
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
