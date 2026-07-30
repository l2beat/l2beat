import { EIGENDA_LAYER_DATA_GAP } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { ChartResolution } from '~/utils/range/range'

// The gap only affects the layer aggregate data source (the "include only
// projects scaling Ethereum" checkbox unchecked); a bucket counts as gapped
// when any part of it overlaps the window.
export function isInEigendaLayerDataGap(
  timestamp: number,
  resolution: ChartResolution,
) {
  const bucketEnd = timestamp + UnixTime.periodToSeconds(resolution)
  return (
    timestamp < EIGENDA_LAYER_DATA_GAP.until &&
    bucketEnd > EIGENDA_LAYER_DATA_GAP.from
  )
}
