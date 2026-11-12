import type { DailyPoint } from '../../../live/simulatedHistory'
import { average } from '../liveMetrics'

export type RangeKey = '90d' | '1y' | 'all'

export const RANGES: { value: RangeKey; label: string }[] = [
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
  { value: 'all', label: '3 years' },
]

const DAYS: Record<RangeKey, number> = {
  '90d': 90,
  '1y': 365,
  all: Number.POSITIVE_INFINITY,
}

export function sliceRange<T>(points: T[], range: RangeKey): T[] {
  const days = DAYS[range]
  return Number.isFinite(days) ? points.slice(-days) : points
}

/** Stats over complete days only: today is still filling, so it would drag every average down */
export interface DayStats {
  yesterday: number
  week: number
  month: number
  record: { value: number; t: number }
}

export function dayStats(
  history: DailyPoint[],
  pick: (point: DailyPoint) => number,
): DayStats {
  const values = history.map(pick)
  let record = { value: Number.NEGATIVE_INFINITY, t: 0 }
  history.forEach((point, i) => {
    const value = values[i] ?? 0
    if (value > record.value) record = { value, t: point.timestamp }
  })
  return {
    yesterday: values.at(-1) ?? 0,
    week: average(values.slice(-7)),
    month: average(values.slice(-30)),
    record,
  }
}
