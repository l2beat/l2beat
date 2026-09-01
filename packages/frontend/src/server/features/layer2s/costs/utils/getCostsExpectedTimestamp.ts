import { UnixTime } from '@l2beat/shared-pure'
import type { ChartResolution } from '~/utils/range/range'

export function getCostsExpectedTimestamp(
  to: UnixTime,
  resolution: ChartResolution,
) {
  return (
    UnixTime.toStartOf(to, resolution) - UnixTime.periodToSeconds(resolution)
  )
}
