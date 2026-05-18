import type { BackendRouterOutputs } from '@l2beat/backend/trpc'

export type ChainSummaryResponse =
  BackendRouterOutputs['interop']['chains']['summary']
export type ChainSummaryRow = ChainSummaryResponse['rows'][number]
