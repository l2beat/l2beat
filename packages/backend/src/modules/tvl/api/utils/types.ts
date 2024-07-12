import { BackendProject } from '@l2beat/config'
import {
  AmountConfigEntry,
  AssetId,
  CanonicalAssetBreakdownData,
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

export interface CanonicalAssetBreakdown {
  assetId: AssetId
  chainId: ChainId
  amount: number
  usdValue: number
  usdPrice: string
  escrows: CanonicalAssetBreakdownData['escrows']
}
export type AmountConfigMap = Map<
  ProjectId,
  (AmountConfigEntry & { configId: string })[]
>
export type PriceConfigIdMap = Map<
  string,
  { assetId: AssetId; priceId: string }
>

export interface ApiProject {
  id: ProjectId
  minTimestamp: UnixTime
  type: BackendProject['type']
  slug: string
  sources: Map<
    string,
    {
      minTimestamp: UnixTime
    }
  >
}
export interface AssociatedToken {
  address: EthereumAddress | 'native'
  chain: string
  type: 'canonical' | 'external' | 'native'
  includeInTotal: boolean
  project: ProjectId
  projectType: 'layers2s' | 'bridges'
}
