import type { BackendRouterOutputs } from '@l2beat/backend/backoffice-trpc'

export type AggregatesResponse =
  BackendRouterOutputs['interop']['aggregates']['latest']
export type NotIncludedByPluginRow =
  AggregatesResponse['notIncludedByPlugin'][number]
export type NotIncludedTransferRow =
  AggregatesResponse['notIncludedTransfers'][number]
export type DurationSplitCoverageRow =
  AggregatesResponse['durationSplitCoverage'][number]
export type ChainMetadata =
  BackendRouterOutputs['interop']['chains']['metadata'][number]
