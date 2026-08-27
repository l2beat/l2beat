import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'

export type PrivacyProject = Project<
  'display' | 'privacyInfo' | 'statuses',
  'tvsConfig' | 'contracts' | 'permissions' | 'discoveryInfo' | 'zkCatalogInfo'
> & {
  /** Own zkCatalogInfo trusted setups, or those of privacyInfo.zkCatalogId. */
  trustedSetups: ProjectZkCatalogInfo['trustedSetups']
}
export interface PrivacyDepositedValueUsd {
  total: number
  last7d: number
  last30d: number
}

export interface PrivacyBucket {
  id: string
  label: string
  type: 'pool' | 'denomination'
  denomination?: string
  totalAmount: number | null
  totalValueUsd: number | null
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  depositedValueUsd: PrivacyDepositedValueUsd
}

export interface PrivacyAsset {
  symbol: string
  iconUrl: string
  address?: string
  decimals: number
  bucketCount: number
  totalAmount: number
  totalValueUsd: number | null
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  depositedValueUsd: PrivacyDepositedValueUsd
  buckets: PrivacyBucket[]
}
