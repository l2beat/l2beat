import type { Project } from '@l2beat/config'
import type { EthereumAddress } from '@l2beat/shared-pure'

export type PrivacyProject = Project<
  'display' | 'privacyInfo' | 'statuses',
  'tvsConfig' | 'contracts' | 'permissions' | 'discoveryInfo'
>

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
  address?: EthereumAddress
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
