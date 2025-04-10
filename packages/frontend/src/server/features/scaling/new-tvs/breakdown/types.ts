import type { TvsToken } from '@l2beat/config'

export type BaseAssetBreakdownData = {
  id: TvsToken['id']
  symbol: TvsToken['symbol']
  iconUrl: string
  amount: number
  usdValue: number
  source: TvsToken['source']
  isAssociated: TvsToken['isAssociated']
  isGasToken?: boolean
}

export type CanonicalAssetBreakdownData = BaseAssetBreakdownData
export type ExternalAssetBreakdownData = BaseAssetBreakdownData
export type NativeAssetBreakdownData = BaseAssetBreakdownData

export type BreakdownRecord = {
  canonical: CanonicalAssetBreakdownData[]
  external: ExternalAssetBreakdownData[]
  native: NativeAssetBreakdownData[]
}
