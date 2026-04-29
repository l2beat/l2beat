import type {
  BackendRouterInputs,
  BackendRouterOutputs,
} from '@l2beat/backend/backoffice-trpc'

export type AnomaliesSummaryResponse =
  BackendRouterOutputs['anomalies']['summary']
export type AggregatedAnomalyRow =
  AnomaliesSummaryResponse['aggregatedItems'][number]
export type SuspiciousTransfersResponse =
  BackendRouterOutputs['anomalies']['suspiciousTransfers']
export type SuspiciousTransferRow = SuspiciousTransfersResponse['items'][number]
export type AggregateDetailsInput =
  BackendRouterInputs['anomalies']['aggregateDetails']
export type AggregateDetailsResponse =
  BackendRouterOutputs['anomalies']['aggregateDetails']
export type AggregateSeriesPoint = AggregateDetailsResponse['items'][number]
export type ChainMetadata = BackendRouterOutputs['chains']['metadata'][number]
export type TransferStatsRow =
  BackendRouterOutputs['transfers']['stats'][number]
