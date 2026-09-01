import { UnixTime } from '@l2beat/shared-pure'
import type { ChartResolution } from '~/utils/range/range'

/**
 * Computes the first timestamp of a single-project chart's x-axis.
 *
 * Charts should span the full selected range rather than collapsing to the
 * first day that happens to have data. For a fixed range we anchor to the
 * requested window start, but never before the project's first ever record (so
 * we don't render days when the project didn't exist). For the 'max' range
 * (null start) we begin at that first record, falling back to the first day
 * with data when the first record is unknown.
 *
 * `firstProjectTimestamp` is bucketed to the resolution so it aligns with the
 * generated axis.
 */
export function getChartStartTimestamp({
  rangeStart,
  firstProjectTimestamp,
  dataStart,
  resolution,
}: {
  rangeStart: number | null
  firstProjectTimestamp: number | undefined
  dataStart: number
  resolution: ChartResolution
}): number {
  const firstRecord =
    firstProjectTimestamp !== undefined
      ? UnixTime.toStartOf(UnixTime(firstProjectTimestamp), resolution)
      : undefined

  if (rangeStart === null) {
    return firstRecord ?? dataStart
  }
  return firstRecord !== undefined
    ? Math.max(rangeStart, firstRecord)
    : rangeStart
}
