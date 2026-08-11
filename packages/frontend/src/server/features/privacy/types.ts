import type { Project } from '@l2beat/config'

export type PrivacyProject = Project<
  'display' | 'privacyInfo' | 'statuses',
  'tvsConfig' | 'contracts' | 'permissions' | 'discoveryInfo' | 'zkCatalogInfo'
>

export interface PrivacyDepositedValueUsd {
  total: number
  last7d: number
  last30d: number
}

export interface PrivacyRelayerStat {
  /**
   * activeRelayers - unique relayer addresses seen in onchain withdrawals
   * over the last 30 days.
   * avgDailyRelayers - average count of unique relayers seen in daily
   * network observations over the last 30 days.
   */
  kind: 'activeRelayers' | 'avgDailyRelayers'
  value: number
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
