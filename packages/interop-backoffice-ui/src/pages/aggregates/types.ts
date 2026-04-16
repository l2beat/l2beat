import type { RouterOutputs } from '@l2beat/backend/interop-trpc'

export type AggregatesResponse = RouterOutputs['aggregates']['latest']
export type NotIncludedByPluginRow =
  AggregatesResponse['notIncludedByPlugin'][number]
export type NotIncludedTransferRow =
  AggregatesResponse['notIncludedTransfers'][number]
export type DurationSplitCoverageRow =
  AggregatesResponse['durationSplitCoverage'][number]
export type ChainMetadata = RouterOutputs['chains']['metadata'][number]
