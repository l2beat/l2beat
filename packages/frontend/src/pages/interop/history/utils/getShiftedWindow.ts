import { UnixTime } from '@l2beat/shared-pure'
import type { InteropHistoryPoint } from '~/server/features/layer2s/interop/history/types'

export interface ShiftedWindow {
  snapshot: number
  /** The 24 hours the snapshot covers. */
  covers: [number, number]
  /** Hours before it that the point before does not reach either. */
  uncovered: [number, number] | undefined
  /** Hours the next point covers too. */
  doubled: [number, number] | undefined
}

/**
 * For a daily point whose snapshot is not at midnight: the 24 hours it covers
 * no longer line up with its neighbours, so some hours are in no point and
 * some are in two. Undefined for a midnight or missing snapshot.
 */
export function getShiftedWindow(
  points: InteropHistoryPoint[],
  index: number,
): ShiftedWindow | undefined {
  const point = points[index]
  if (!point || point.snapshot === null || point.snapshot === point.timestamp) {
    return undefined
  }
  const start = point.snapshot - UnixTime.DAY
  const previousEnd = points[index - 1]?.snapshot ?? null
  const nextStart = points[index + 1]?.snapshot
  return {
    snapshot: point.snapshot,
    covers: [start, point.snapshot],
    uncovered:
      previousEnd !== null && previousEnd < start
        ? [previousEnd, start]
        : undefined,
    doubled:
      nextStart !== undefined &&
      nextStart !== null &&
      nextStart - UnixTime.DAY < point.snapshot
        ? [nextStart - UnixTime.DAY, point.snapshot]
        : undefined,
  }
}
