import type { Formula, TvsToken } from '@l2beat/config'
import type { EthereumAddress } from '@l2beat/shared-pure'

type AddressData =
  | {
      address: EthereumAddress
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
  source: TvsToken['source']
  isAssociated: TvsToken['isAssociated']
  isGasToken?: boolean
  address?: AddressData
  formula: Formula
  syncStatus?: string
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
