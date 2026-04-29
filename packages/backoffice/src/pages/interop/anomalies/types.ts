import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/trpc'

export type AnomaliesSummaryResponse =
  BackendRouterOutputs['interop']['anomalies']['summary']
export type AggregatedAnomalyRow =
  AnomaliesSummaryResponse['aggregatedItems'][number]
export type SuspiciousTransfersResponse =
  BackendRouterOutputs['interop']['anomalies']['suspiciousTransfers']
export type SuspiciousTransferRow = SuspiciousTransfersResponse['items'][number]
export type AggregateDetailsInput =
  BackendRouterInputs['interop']['anomalies']['aggregateDetails']
export type AggregateDetailsResponse =
  BackendRouterOutputs['interop']['anomalies']['aggregateDetails']
export type AggregateSeriesPoint = AggregateDetailsResponse['items'][number]
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
export type TransferStatsRow =
  BackendRouterOutputs['interop']['transfers']['stats'][number]
