import type { BackendRouterOutputs } from '@l2beat/backend/trpc'

export type ChainsSummaryBackendChain =
  BackendRouterOutputs['interop']['chains']['summary'][number]

export interface ChainsSummaryFrontendChain {
  id: string
  isUpcoming: boolean
}

export interface ChainsSummaryRow {
  id: string
  name: string
  display: string
  color: string
  iconUrl: string | undefined
  enabledOnProductionFrontend: boolean
  enabledOnProductionFrontendUpcoming: boolean
  enabledOnProductionBackendCapture: boolean
  enabledOnProductionBackendOneSided: boolean
  enabledOnStagingFrontend: boolean
  enabledOnStagingFrontendUpcoming: boolean
  enabledOnStagingBackendCapture: boolean
  enabledOnStagingBackendOneSided: boolean
  missingTokensCount: number | undefined
  suspiciousTransfersCount: number | undefined
  notIncludedTransfersCount: number | undefined
}
