import {
  type Layer2,
  type Layer3,
  type OnchainVerifier,
  type RequiredTool,
  type ZkCatalogProject,
} from '@l2beat/config'

export type Project = Layer2 | Layer3 | ZkCatalogProject

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
