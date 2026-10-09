import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyPromise,
  Project,
  ProjectZkCatalogInfo,
} from '@l2beat/config'

export type PrivacyProject = Project<
  'display' | 'privacyInfo' | 'statuses',
  | 'tvsConfig'
  | 'contracts'
  | 'permissions'
  | 'discoveryInfo'
  | 'discoveryUpdates'
  | 'crops'
  | 'zkCatalogInfo'
  | 'ossificationHistory'
  | 'milestones'
  | 'auditCoverage'
> & {
  /** Own zkCatalogInfo trusted setups, or those of privacyInfo.zkCatalogId. */
  trustedSetups: ProjectZkCatalogInfo['trustedSetups']
}
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

/** One adversary cell, reduced to what the rosette and dots need. */
export interface PrivacyAdversarySummaryCell {
  id: PrivacyAdversaryId
  label: string
  value: string
  sentiment: PrivacyAdversarySentiment
  /** The cell's short description, which carries the reason for the sentiment. */
  reason: string
}

export interface PrivacyAdversariesSummary {
  promise: PrivacyPromise
  /** Name of the promise, e.g. "Link privacy". */
  promiseLabel: string
  /** In spine order: public observer, chain analyst, network observer, insider, future. */
  cells: PrivacyAdversarySummaryCell[]
}
