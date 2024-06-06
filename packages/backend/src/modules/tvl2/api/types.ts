import {
  AmountConfigEntry,
  AssetId,
  CanonicalAssetBreakdownData,
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { Project } from '../../../model/Project'

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
export type Values = {
  external: bigint
  canonical: bigint
  native: bigint
}
export type ValuesMap = Map<number, Values>

export interface ApiProject {
  id: ProjectId
  minTimestamp: UnixTime
  type: Project['type']
  slug: string
  sources: Map<
    string,
    {
      name: string
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
