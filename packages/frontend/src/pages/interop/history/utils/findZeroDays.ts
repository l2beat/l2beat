import { getWindowMedian } from '~/server/features/layer2s/interop/history/buildHistoryPoints'
import {
  ZERO_DAY_MIN_USUAL_TRANSFERS,
  ZERO_DAY_WINDOW,
} from '~/server/features/layer2s/interop/history/historyRules'
import type { InteropHistoryData } from '~/server/features/layer2s/interop/history/types'

export interface HistoryZeroDay {
  point: number
  id: string
  /** The protocol's median transfer count over ±7 days. */
  usual: number
}

/**
 * Points where a usually active protocol has no transfers at all. A syncer
 * outage is stored like that, but so is a paused bridge, so these are only
 * marked.
 */
export function findZeroDays(data: InteropHistoryData): HistoryZeroDay[] {
  const timestamps = data.points.map((p) => p.timestamp)
  const min = ZERO_DAY_MIN_USUAL_TRANSFERS[data.resolution]
  const zeroDays: HistoryZeroDay[] = []
  for (const [id, series] of Object.entries(data.byProtocol)) {
    const counts = data.points.map((point, i) =>
      point.snapshot === null ? undefined : series.transferCount[i],
    )
    for (const [i, count] of counts.entries()) {
      if (count !== 0) continue
      const usual = getWindowMedian(timestamps, counts, i, ZERO_DAY_WINDOW)
      if (usual >= min) zeroDays.push({ point: i, id, usual })
    }
  }
  return zeroDays
}
