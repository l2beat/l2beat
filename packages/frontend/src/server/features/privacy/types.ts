import type {
  Project,
  ProjectDisplay,
  ProjectPermissions,
  ProjectStatuses,
  TrustedSetup,
} from '@l2beat/config'
import type { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

export type PrivacyProjectConfig = Project<
  'display' | 'privacyInfo' | 'statuses',
  'permissions' | 'discoveryInfo'
>

export interface PrivacyBucketSnapshot {
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
}

export interface PrivacyAssetSnapshot {
  symbol: string
  address?: EthereumAddress
  decimals: number
  priceUsd: number | null
  bucketCount: number
  totalAmount: number
  totalValueUsd: number | null
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  buckets: PrivacyBucketSnapshot[]
}

export interface PrivacyProjectSnapshot {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  display: ProjectDisplay
  permissions?: Record<string, ProjectPermissions>
  statuses: ProjectStatuses
  trustedSetup: TrustedSetup
  assets: PrivacyAssetSnapshot[]
  summary: {
    totalValueSecuredUsd: number
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
    ethWethDeposits: {
      total: number
      last7d: number
      last30d: number
    }
  }
  unpricedAssets: string[]
}

export interface PrivacySnapshot {
  generatedAt: string
  projects: PrivacyProjectSnapshot[]
  overview: {
    projectCount: number
    totalValueSecuredUsd: number
    ethWethDeposits30d: number
  }
}
