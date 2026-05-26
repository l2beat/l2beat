import type { BackendRouterOutputs } from '@l2beat/backend/trpc'

export type ChainsSummaryBackendChain =
  BackendRouterOutputs['interop']['chains']['summary'][number]

export interface ChainsSummaryFrontendChain {
  id: string
  isUpcoming: boolean
}

export type EnvironmentChainSummaryData = {
  frontend: {
    enabled: boolean
    upcoming: boolean
  }
  backend: {
    capture: boolean
    oneSided: boolean
  }
}

export interface ChainsSummaryRow {
  id: string
  name: string
  display: string
  color: string
  iconUrl: string | undefined
  production: EnvironmentChainSummaryData
  staging: EnvironmentChainSummaryData
  missingTokensCount: number | undefined
  suspiciousTransfersCount: number | undefined
  notIncludedTransfersCount: number | undefined
}
