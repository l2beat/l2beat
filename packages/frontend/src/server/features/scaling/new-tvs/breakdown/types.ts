import type { TvsToken } from '@l2beat/config'
import type { EthereumAddress } from '@l2beat/shared-pure'

export type BaseAssetBreakdownData = {
  id: TvsToken['id']
  symbol: TvsToken['symbol']
  iconUrl: string
  amount: number
  usdValue: number
  source: TvsToken['source']
  isAssociated: TvsToken['isAssociated']
  isGasToken?: boolean
  address?:
    | {
        address: EthereumAddress
        url?: string
      }
    | 'multiple'
}

export type CanonicalAssetBreakdownData = BaseAssetBreakdownData
export type ExternalAssetBreakdownData = BaseAssetBreakdownData
export type NativeAssetBreakdownData = BaseAssetBreakdownData

export type BreakdownRecord = {
  canonical: CanonicalAssetBreakdownData[]
  external: ExternalAssetBreakdownData[]
  native: NativeAssetBreakdownData[]
}
