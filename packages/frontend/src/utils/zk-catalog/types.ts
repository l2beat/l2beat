import {
  Layer2,
  Layer3,
  OnchainVerifier,
  RequiredTool,
  ZkCatalogProject,
} from '@l2beat/config'

export type Project = Layer2 | Layer3 | ZkCatalogProject

export interface ZkCatalogProofVerification {
  shortDescription: string | undefined
  aggregation: boolean
  verifiers: ZkCatalogOnchainVerifier[]
  requiredTools: RequiredTool[]
}

export interface ZkCatalogOnchainVerifier extends OnchainVerifier {
  lastUsedDaysAgo: number | undefined
}
