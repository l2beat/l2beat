import type { RouterOutputs } from '@l2beat/interop-backoffice'

export type SummaryEventRow = RouterOutputs['summary']['events'][number]
export type SummaryEventDetailsRow =
  RouterOutputs['summary']['eventsDetails'][number]
export type SummaryMessageRow = RouterOutputs['summary']['messages'][number]
export type SummaryMessageDetailsRow =
  RouterOutputs['summary']['messagesDetails'][number]
export type SummaryMessagePairRow = SummaryMessageRow['chains'][number]
export type SummaryTransferRow = RouterOutputs['summary']['transfers'][number]
export type SummaryTransferDetailsRow =
  RouterOutputs['summary']['transfersDetails'][number]
export type SummaryTransferPairRow = SummaryTransferRow['chains'][number]
export type SummaryChainMetadata = RouterOutputs['chains']['metadata'][number]
export type SummaryMissingTokenRow =
  RouterOutputs['summary']['missingTokens'][number]
export type SummaryKnownAppsRow = RouterOutputs['summary']['knownApps'][number]
export type SummaryCoveragePiesData = RouterOutputs['summary']['coveragePies']
export type SummaryCoveragePieChart = SummaryCoveragePiesData['charts'][number]
export type SummaryAggregatesData = RouterOutputs['summary']['aggregates']
export type SummaryAggregateNotIncludedByPluginRow =
  NonNullable<SummaryAggregatesData>['notIncludedByPlugin'][number]
export type SummaryAggregateDurationSplitCoverageRow =
  NonNullable<SummaryAggregatesData>['durationSplitCoverage'][number]
export type SummaryAnomaliesData = RouterOutputs['summary']['anomalies']
export type SummaryAnomalyRow = SummaryAnomaliesData['stats'][number]
export type SummaryAnomalySuspiciousTransferRow =
  SummaryAnomaliesData['suspiciousTransfers'][number]
export type SummaryAnomalySeriesData = RouterOutputs['summary']['anomalySeries']
export type SummaryAnomalySeriesPoint =
  SummaryAnomalySeriesData['points'][number]
