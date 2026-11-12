import { createContext, type ReactNode, use, useMemo } from 'react'
import { type DailyPoint, getSimulatedHistory } from '../live/simulatedHistory'
import type { DailyValue } from '../ui/DailyChart'

const HistoryContext = createContext<DailyPoint[]>([])

/** Seeded, so the server and the browser compute the same days */
export function HistoryProvider({
  historyEnd,
  children,
}: {
  historyEnd: number
  children: ReactNode
}) {
  const history = useMemo(() => getSimulatedHistory(historyEnd), [historyEnd])
  return <HistoryContext value={history}>{children}</HistoryContext>
}

export function useHistory() {
  return use(HistoryContext)
}

export type Range = '90d' | '1y' | 'all'

export const RANGES = [
  { id: '90d', label: '90D' },
  { id: '1y', label: '1Y' },
  { id: 'all', label: 'All' },
] as const

const RANGE_DAYS: Record<Range, number> = {
  '90d': 90,
  '1y': 365,
  all: Number.POSITIVE_INFINITY,
}

export function series(
  history: DailyPoint[],
  range: Range,
  pick: (p: DailyPoint) => number,
): DailyValue[] {
  const days = RANGE_DAYS[range]
  const from = Number.isFinite(days) ? history.length - days : 0
  return history
    .slice(Math.max(0, from))
    .map((p) => ({ t: p.timestamp, v: pick(p) }))
}

/** Mean over the last `days` complete days */
export function recentMean(
  history: DailyPoint[],
  pick: (p: DailyPoint) => number,
  days = 30,
) {
  const recent = history.slice(-days)
  if (recent.length === 0) return undefined
  return recent.reduce((sum, p) => sum + pick(p), 0) / recent.length
}
