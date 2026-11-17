import type { UnixTime } from '@l2beat/shared-pure'

/** The lanes of some snapshots: `srcChain` in `sourceChains`, `dstChain` in `destinationChains`. */
export interface AggregatedInteropHistoryFilter {
  timestamps: UnixTime[]
  sourceChains: string[]
  destinationChains: string[]
  protocolIds?: string[]
}

export function isEmptyFilter(filter: AggregatedInteropHistoryFilter) {
  return (
    filter.timestamps.length === 0 ||
    filter.sourceChains.length === 0 ||
    filter.destinationChains.length === 0 ||
    filter.protocolIds?.length === 0
  )
}
