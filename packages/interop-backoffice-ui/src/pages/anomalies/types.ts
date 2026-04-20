import type { RouterInputs, RouterOutputs } from '@l2beat/backend/interop-trpc'

export type AnomaliesSummaryResponse = RouterOutputs['anomalies']['summary']
export type AggregatedAnomalyRow =
  AnomaliesSummaryResponse['aggregatedItems'][number]
export type SuspiciousTransfersResponse =
  RouterOutputs['anomalies']['suspiciousTransfers']
export type SuspiciousTransferRow = SuspiciousTransfersResponse['items'][number]
export type AggregateDetailsInput =
  RouterInputs['anomalies']['aggregateDetails']
export type AggregateDetailsResponse =
  RouterOutputs['anomalies']['aggregateDetails']
export type AggregateSeriesPoint = AggregateDetailsResponse['items'][number]
export type ChainMetadata = RouterOutputs['chains']['metadata'][number]
export type TransferStatsRow = RouterOutputs['transfers']['stats'][number]
