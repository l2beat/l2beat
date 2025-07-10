import type { OnchainVerifier, RequiredTool } from '@l2beat/config'

export interface ZkCatalogProofVerification {
  /** Short version of the description shown on the summary page and before long description on the detail page */
  shortDescription: string | undefined
  aggregation: boolean
  verifiers: ZkCatalogOnchainVerifier[]
  requiredTools: RequiredTool[]
}

export type ZkCatalogOnchainVerifier = OnchainVerifier & {
  lastUsedDaysAgo: number | undefined
}
