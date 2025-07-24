import type { Formula, TvsToken } from '@l2beat/config'

type AddressData =
  | {
      address: string
      url?: string
      name?: string
    }
  | 'multiple'

export type BaseAssetBreakdownData = {
  id: TvsToken['id']
  symbol: TvsToken['symbol']
  iconUrl: string
  amount: number
  usdValue: number
  category: TvsToken['category']
  source: TvsToken['source']
  isAssociated: TvsToken['isAssociated']
  isGasToken?: boolean
  address?: AddressData
  formula: Formula
  syncStatus?: string
  bridgedUsing?: {
    bridges: {
      name: string
      slug?: string
    }[]
    warning?: string
  }
}

export type CanonicalAssetBreakdownData = BaseAssetBreakdownData & {
  escrow?: AddressData
}
export type ExternalAssetBreakdownData = BaseAssetBreakdownData
export type NativeAssetBreakdownData = BaseAssetBreakdownData

export type BreakdownRecord = {
  canonical: CanonicalAssetBreakdownData[]
  external: ExternalAssetBreakdownData[]
  native: NativeAssetBreakdownData[]
}
