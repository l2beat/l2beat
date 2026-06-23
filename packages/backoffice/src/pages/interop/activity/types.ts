import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/trpc'

export type ActivitySummaryResponse =
  BackendRouterOutputs['interop']['activity']['summary']
export type AggregatedActivityRow =
  ActivitySummaryResponse['aggregatedItems'][number]
export type SuspiciousTransfersResponse =
  BackendRouterOutputs['interop']['activity']['suspiciousTransfers']
export type SuspiciousTransferRow = SuspiciousTransfersResponse['items'][number]
export type AggregateDetailsInput =
  BackendRouterInputs['interop']['activity']['aggregateDetails']
export type AggregateDetailsResponse =
  BackendRouterOutputs['interop']['activity']['aggregateDetails']
export type AggregateSeriesPoint = AggregateDetailsResponse['items'][number]
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
export type TransferStatsRow =
  BackendRouterOutputs['interop']['transfers']['stats'][number]
