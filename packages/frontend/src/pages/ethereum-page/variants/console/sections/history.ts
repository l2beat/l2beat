import type { DailyPoint } from '../../../live/simulatedHistory'
import { UPGRADES } from '../../../live/simulatedHistory'
import type { ChartMarker } from '../ui/HistoryChart'

export type Range = '30d' | '90d' | '1y' | 'all'

export const RANGES = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'All' },
] as const

const RANGE_DAYS: Record<Range, number> = {
  '30d': 30,
  '90d': 90,
  '1y': 365,
  all: Number.POSITIVE_INFINITY,
}

export function sliceRange(history: DailyPoint[], range: Range) {
  const days = RANGE_DAYS[range]
  return Number.isFinite(days) ? history.slice(-days) : history
}

export const UPGRADE_MARKERS: ChartMarker[] = UPGRADES.map((u) => ({
  timestamp: u.timestamp,
  label: u.name,
}))

/** The chart's days, with today's partial day appended when the stream has one */
export function withToday(
  points: DailyPoint[],
  todayStartedAt: number | undefined,
) {
  const timestamps = points.map((p) => p.timestamp)
  if (todayStartedAt !== undefined) timestamps.push(todayStartedAt)
  return timestamps
}
