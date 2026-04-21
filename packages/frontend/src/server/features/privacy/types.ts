import type {
  Project,
  ProjectContracts,
  ProjectDisplay,
  ProjectPermissions,
  ProjectStatuses,
  TrustedSetup,
} from '@l2beat/config'
import type { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

export type PrivacyProjectConfig = Project<
  'display' | 'privacyInfo' | 'statuses',
  'contracts' | 'permissions' | 'discoveryInfo'
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
  contracts?: ProjectContracts
  permissions?: Record<string, ProjectPermissions>
  statuses: ProjectStatuses
  trustedSetup: TrustedSetup
  upgradesAndGovernance?: string
  assets: PrivacyAssetSnapshot[]
  summary: {
    totalValueSecuredUsd: number
    bucketCount: number
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
    depositedValueUsd: {
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
    deposits30d: number
  }
}
